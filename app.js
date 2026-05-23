/* ==========================================================================
   TALE OF THE WINDS - INTERACTIVE ENGINE (app.js)
   ========================================================================== */

// State variables
let currentChapterId = 1;
let activeParagraphId = 0;
let fontSizeLevel = 1; // 0: 1.05rem, 1: 1.15rem, 2: 1.25rem, 3: 1.35rem
let isAudioPlaying = false;
let isTtsActive = false;
let isAutoScrolling = false;
let autoScrollTimer = null;
let selectedTheme = 'forest';
let ttsUtterance = null;
let bgmAudio = null;

// Particle system variables
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let particlesEnabled = true;

// Custom weather system variables
let eggCracks = [];
let sanctifyingScanActive = false;
let sanctifyingScanX = -200;

// Selected chapters illustration database
const ILLUSTRATIONS = {
    1: { src: 'Assets/chapter_1_scene.png', alt: 'Khởi Phong - Sườn núi Morgard rực đỏ hoàng hôn cuối đông' },
    2: { src: 'Assets/chapter_2_scene.png', alt: 'Sự thức tỉnh của Hỏa Long Rakan sải cánh trên miệng núi lửa rực cháy' },
    3: { src: 'Assets/chapter_3_scene.png', alt: 'Cầu vồng tinh thể lấp lánh nối đỉnh lửa Ignir và núi tuyết Elina trên thảm rừng Akine xanh ngát' },
    4: { src: 'Assets/chapter_4_scene.png', alt: 'Cung điện Vaala của High Elf rực sáng ánh lửa ma thuật trên đỉnh vách đá Ignir trong hoàng hôn' },
    5: { src: 'Assets/chapter_5_scene.png', alt: 'Ngôi làng thú nhân Aniz lấp lánh đèn lồng ấm cúng bên dưới gốc đại thụ Akine linh thiêng' },
    6: { src: 'Assets/chapter_6_scene.png', alt: 'Quảng trường làng Tunggal rực cháy đống lửa lớn giữa thung lũng sâu lúc chạng vạng' },
    7: { src: 'Assets/chapter_7_scene.png', alt: 'Ngã ba dòng suối pha lê và gốc đa ba nhánh cổ kính mở lối vào làng Blomine' },
    8: { src: 'Assets/chapter_8_scene.png', alt: 'Vua Varus ngồi trầm ngâm bên chiếc bàn sa bàn gỗ ma thuật của rừng Akine trong phòng nghị sự' },
    9: { src: 'Assets/chapter_9_scene.png', alt: 'Cặp sói bóng tối mắt xanh huỳnh quang lướt đi bên bờ suối làng Blomine trong đêm giông bão' },
    10: { src: 'Assets/chapter_10_scene.png', alt: 'Quả trứng Long tộc kỳ lạ tỏa sắc ngọc bích lam tím huyền ảo nơi hang động cổ xưa' },
    11: { src: 'Assets/chapter_11_scene.png', alt: 'Chú chim ngọc bích ngậm quả Akkai đỏ rực bay về tổ trên hốc cây bách cổ thụ' },
    12: { src: 'Assets/chapter_12_scene.png', alt: 'Đoàn quân High Elf cưỡi tuần lộc giáp bạc oai phong dẫn đầu bởi bạch mã trắng dưới bình minh' },
    13: { src: 'Assets/chapter_13_scene.png', alt: 'Cảnh tiễn biệt đầy lưu luyến của người dân bên cổng gỗ cổ kính làng Tunggal hừng đông' },
    14: { src: 'Assets/chapter_14_scene.png', alt: 'Thần chết Reaper cầm lưỡi liềm phát sáng lơ lửng đối đầu thú nhân Talia trong rừng tối' },
    15: { src: 'Assets/chapter_15_scene.png', alt: 'Các đại pháp sư High Elf đứng quanh pháp trận sao năm cánh đang nhạt dần trên đồng sương' },
    16: { src: 'Assets/chapter_16_scene.png', alt: 'Thiếu phụ giặt chân bên hồ nước trong vắt phản chiếu bóng cổ thụ Akkai khổng lồ' },
    17: { src: 'Assets/chapter_17_scene.png', alt: 'Mũi tên lửa ma thuật rực cháy xuyên thủng cổ họng xác sống hung hãn trong rừng Akine' },
    18: { src: 'Assets/chapter_18_scene.png', alt: 'Cuộc huyết chiến bên Hồ Đen 20 năm trước giữa thú nhân Aniz và Dark Knight giáp đen' },
    19: { src: 'Assets/chapter_19_scene.png', alt: 'Cột Thần quang khổng lồ giáng xuống từ vòng tròn ma pháp trên bầu trời đêm, thiêu rụi hàng vạn tử vật và cứu rỗi liên quân' },
    20: { src: 'Assets/chapter_20_scene.png', alt: 'Zariond cưỡi sói băng Talia cùng Milenia trên bạch mã rời bìa rừng Akine, phi về phía hoàng hôn trên thảo nguyên mênh mông — hành trình mới bắt đầu' }
};

// Epic lore scroll text library for each region and crystal properties
// Epic 20 Nemarian Facts database
const NEMARIAN_FACTS = [
    {
        title: "Lục địa Nemarian",
        content: "Một vùng đất rộng lớn với địa hình đa dạng, nơi chung sống của nhiều chủng tộc như Nhân tộc, Tiên tộc, Người thú (Aniz) và các sinh vật hắc ám sau trận thánh chiến Armageddon 1000 năm trước. Điểm nhấn địa lý quan trọng nhất là dãy Kronos – \"nóc nhà của đại lục\", nơi bắt nguồn của dòng sông Narime huyết mạch."
    },
    {
        title: "Rừng Akine",
        content: "Một cấm địa bất khả xâm phạm đối với Nhân tộc, đóng vai trò là biên giới tự nhiên giữa quốc gia Akhaban và Asteria. Khu rừng này ẩn chứa vô số dã thú nguy hiểm, các loài ma thú bị ám hóa và cũng là nơi tọa lạc của các phong ấn cổ xưa giam giữ linh hồn quỷ dữ."
    },
    {
        title: "Thánh địa Midhelm",
        content: "Thủ phủ của tộc High Elf, được xây dựng trên núi Ignir và hồ Nawa giữa trung tâm rừng Akine. Kiến trúc nơi đây vô cùng tinh mỹ với những ngôi nhà trên thân cây cổ thụ khổng lồ, hệ thống \"thăng giáng bàn\" ma thuật và những cây cầu nổi lơ lửng nhờ đá phản trọng lực."
    },
    {
        title: "Người Aniz (Người thú)",
        content: "Một chủng tộc có khả năng biến hình dựa trên đặc tính của các loài thú tự nhiên. Họ sống trong 13 ngôi làng rải rác khắp rừng Akine, trong đó làng Tunggal là nơi nhân vật chính Zariond lớn lên."
    },
    {
        title: "Thú Ấn (Beast Mark)",
        content: "Dấu ấn sức mạnh xuất hiện trên cơ thể trẻ em Aniz từ 5 đến 10 tuổi, đặc trưng cho loài thú hộ thân mà chúng nắm giữ. Người sở hữu có thể hóa hình một phần hoặc toàn bộ cơ thể để sử dụng sức mạnh thể chất và pháp thuật bản năng của loài thú đó."
    },
    {
        title: "Hóa thú toàn phần",
        content: "Trạng thái chiến đấu tối thượng của người Aniz, cho phép họ bộc phát toàn bộ sức mạnh nguyên thủy nhưng cũng đầy rủi ro. Nếu lạm dụng hoặc mất kiểm soát trong trạng thái này, họ có thể bị \"thú hóa\" vĩnh viễn và không thể trở lại hình dáng con người."
    },
    {
        title: "Mạch ma pháp & Pháp căn",
        content: "Hệ thống vận hành năng lượng cổ xưa trong cơ thể sinh vật, cho phép hấp thụ trực tiếp ma lực từ tự nhiên. Ở hầu hết con người, hệ thống này đã bị thoái hóa do quá phụ thuộc vào vật dẫn bên ngoài, nhưng Zariond là một ngoại lệ hiếm hoi sở hữu Mạch ma pháp nguyên vẹn."
    },
    {
        title: "Thuộc tính Trắng",
        content: "Một thuộc tính pháp thuật đặc biệt khiến người sở hữu không có thuộc tính gốc cố định, giống như một \"chiếc bình thủy tinh rỗng\". Điểm yếu là tiêu tốn năng lượng cực lớn và khó dùng phép cấp cao, nhưng nếu khai mở được Mạch ma pháp, người sở hữu có thể thi triển mọi hệ phép thuật mà không cần vật dẫn."
    },
    {
        title: "Thất đại phong ấn",
        content: "Hệ thống bảy điểm phong ấn bí mật trên lục địa, nơi giam giữ bảy mảnh linh hồn bị chia cắt của Quỷ Vương Xerath sau trận thánh chiến. Mỗi phong ấn đều sử dụng một thần khí cổ xưa để duy trì kết giới dựa trên chính nguồn ma lực của mảnh linh hồn bên trong."
    },
    {
        title: "Hồ Đen (Black Lake)",
        content: "Một trong Thất đại phong ấn nằm trong rừng Akine, có nước đen đặc như hắc ín và bốc mùi tử khí. Tại tâm hồ có một hòn đảo đá trơ trọi đặt pháp trận phong ấn, nơi Sieth đã thực hiện nghi lễ hiến tế máu để giải phóng mảnh linh hồn Quỷ Vương."
    },
    {
        title: "Sieth (Kẻ sa đọa)",
        content: "Em trai của vua High Elf Varus, một thiên tài pháp thuật bị biến chất do đố kỵ và bị thực thể Lich quyền năng nhập xác. Hắn là kẻ duy nhất sở hữu đồng thời ba thuộc tính pháp thuật: Hỏa, Lôi và Ám, cũng như có tri thức uyên bác về các phong ấn cổ xưa."
    },
    {
        title: "Hồn Ngọc (Soul Orbs)",
        content: "Những viên đá hình giọt nước màu đỏ máu chứa đựng mảnh linh hồn tà ác của Quỷ Vương. Khi được giải phóng và hấp thụ vào chiếc nhẫn đầu lâu, chúng ban cho Sieth nguồn sức mạnh hắc ám khổng lồ và khả năng thao túng các sinh vật chết chóc."
    },
    {
        title: "Cốt Long (Bone Dragon)",
        content: "Một con rồng xương khổng lồ được Sieth triệu hồi từ lòng đất hồ Đen, có ngọn lửa xanh ma quái cháy rực trong hốc mắt. Nó sở hữu đòn tấn công Mortis Murus (Bức tường chết chóc) phun ra luồng tử khí và axit cực độc có thể ăn mòn cả kim loại lẫn linh hồn."
    },
    {
        title: "Milenia (Công chúa High Elf)",
        content: "Con gái út của vua Varus, sở hữu năng khiếu pháp thuật vượt trội, đặc biệt là Thủy hệ và thuật trị liệu. Cô đã giả dạng mạo hiểm giả tên Mina để bỏ trốn khỏi Midhelm và trở thành người dẫn dắt Zariond trên con đường khám phá sức mạnh thật sự."
    },
    {
        title: "Talia & Marcus",
        content: "Hai con sói băng khổng lồ (Sói ma thú), là con của đôi sói đã theo bảo vệ Hanu từ 20 năm trước. Chúng có linh trí cao, có khả năng tạo ra vuốt băng sắc lẻm và là những người bạn đồng hành trung thành nhất của anh em Zariond."
    },
    {
        title: "Cây Akkai",
        content: "Thần thụ của làng Tunggal, có bộ rễ cắm sâu vào lòng đất bao trọn một khối ma thạch khổng lồ. Cây có khả năng tương tác với các pháp sư để tạo ra một kết giới phòng thủ hùng mạnh bảo vệ toàn bộ ngôi làng khỏi các đợt tấn công của tà vật."
    },
    {
        title: "Cây Aqua",
        content: "Loài thực vật đặc hữu của làng Blomine, có rễ chứa đầy nước dinh dưỡng rủ xuống từ vách núi như những tấm rèm. Vào ban đêm, các bọng nước trên rễ cây sẽ phát sáng màu tím huyền ảo, tạo nên kỳ quan ánh sáng độc đáo trong lòng núi Bloodmoon."
    },
    {
        title: "Thú Triều (Beast Tide)",
        content: "Hiện tượng tà vật thoát khỏi phong ấn, sử dụng năng lượng hắc ám để \"ám hóa\" các loài ma thú và dã thú, điều khiển chúng tấn công ồ ạt vào các khu dân cư. Đây là thảm họa kinh hoàng nhất mà các làng người Aniz từng phải đối mặt."
    },
    {
        title: "Lưu Ảnh Thạch (Memory Stone)",
        content: "Một vật phẩm ma pháp quý giá có hình cuốn sách mở khảm đá xanh, dùng để lưu giữ ký ức và hình ảnh của người sở hữu. Zariond đã nhờ nó mà chứng kiến được toàn bộ bi kịch tại Ngôi nhà đá trắng và sự hy sinh của cha mẹ ruột mình."
    },
    {
        title: "Amber (Rồng lửa con)",
        content: "Một chú rồng đỏ nở ra từ quả trứng quý giá của rồng Rakan mà Zariond tình cờ tìm thấy dưới suối. Amber có khả năng hấp thụ lửa, lớn nhanh như thổi và sở hữu một dạ dày \"không đáy\" giống hệt chủ nhân của mình."
    }
];

// Active state and displays mapping per chapter
const CHAPTER_METADATA = {
    1: { theme: 'forest', mapGlow: 'akine', loreKey: 'akine' },
    2: { theme: 'forest', mapGlow: 'akine', loreKey: 'akine' },
    3: { theme: 'crimson', mapGlow: 'morgard', loreKey: 'morgard' },
    4: { theme: 'crimson', mapGlow: 'morgard', loreKey: 'morgard' },
    5: { theme: 'earth', mapGlow: 'york', loreKey: 'york' },
    6: { theme: 'earth', mapGlow: 'york', loreKey: 'york' },
    7: { theme: 'mana', mapGlow: 'aria', loreKey: 'aria' },
    8: { theme: 'mana', mapGlow: 'aria', loreKey: 'aria' },
    9: { theme: 'void', mapGlow: 'morgard', loreKey: 'void_rift' },
    10: { theme: 'void', mapGlow: 'morgard', loreKey: 'void_rift' },
    11: { theme: 'forest', mapGlow: 'akine', loreKey: 'akine' },
    12: { theme: 'mana', mapGlow: 'aria', loreKey: 'aria' },
    13: { theme: 'divine', mapGlow: 'aria', loreKey: 'divine_light' },
    14: { theme: 'divine', mapGlow: 'aria', loreKey: 'divine_light' },
    15: { theme: 'void', mapGlow: 'morgard', loreKey: 'void_rift' },
    16: { theme: 'forest', mapGlow: 'akine', loreKey: 'akine' },
    17: { theme: 'void', mapGlow: 'morgard', loreKey: 'void_rift' },
    18: { theme: 'earth', mapGlow: 'york', loreKey: 'york' },
    19: { theme: 'divine', mapGlow: 'aria', loreKey: 'divine_light' },
    20: { theme: 'divine', mapGlow: 'aria', loreKey: 'divine_light' }
};

const THEME_PARTICLES = {
    forest: { color: ['#10b981', '#fbbf24', '#34d399'], count: 60, speed: 0.1 },
    crimson: { color: ['#ef4444', '#f97316', '#f59e0b'], count: 75, speed: 0.15, direction: -1 },
    mana: { color: ['#a855f7', '#06b6d4', '#ec4899'], count: 68, speed: 0.08 },
    void: { color: ['#4f46e5', '#312e81', '#6366f1'], count: 45, speed: 0.05 },
    divine: { color: ['#fbbf24', '#ffffff', '#38bdf8'], count: 82, speed: 0.12 },
    earth: { color: ['#d97706', '#84cc16', '#78350f'], count: 52, speed: 0.07 }
};

const CHAPTER_LOCATIONS = {
    1: { name: "Núi Morgard (Đỉnh Đinh Ba)", x: 72, y: 6 },
    2: { name: "Hang Rồng Rakan (Núi Morgard)", x: 67, y: 17 },
    3: { name: "Núi Ignir (Đỉnh Thiêng)", x: 62, y: 25 },
    4: { name: "Hồ Nawa (Gương Soi Vĩnh Cửu)", x: 62, y: 38 },
    5: { name: "Thung lũng Làng Tunggal", x: 45, y: 28 },
    6: { name: "Quảng trường Làng Tunggal", x: 49, y: 31 },
    7: { name: "Ngã Ba Suối (Bìa Rừng)", x: 58, y: 56 },
    8: { name: "Thánh địa Midhelm", x: 62, y: 56 },
    9: { name: "Làng Blomine (Núi Bloodmoon)", x: 62, y: 67 },
    10: { name: "Đầm suối Làng Tunggal", x: 49, y: 43 },
    11: { name: "Tiểu Đảo giữa Hồ Đen", x: 85, y: 33 },
    12: { name: "Sườn Núi Sau Làng Tunggal", x: 47, y: 39 },
    13: { name: "Trại Liên Quân Ven Hồ Đen", x: 76, y: 35 },
    14: { name: "Trại Hậu Cần Rừng Akine", x: 69, y: 32 },
    15: { name: "Tế Đàn Bờ Hồ Đen", x: 88, y: 38 },
    16: { name: "Hồ Thần Thụ Cây Akkai", x: 41, y: 40 },
    17: { name: "Chiến Trường Lòng Chảo Hồ Đen", x: 80, y: 41 },
    18: { name: "Hồ Đen", x: 89, y: 30 },
    19: { name: "Gò Đất Cao Ven Hồ Đen", x: 79, y: 40 },
    20: { name: "Vách Núi Nam Hồ Đen (Cốt Long)", x: 85, y: 47 }
};

const CHAPTER_WEATHER_TYPES = {
    1: 'firefly',
    2: 'ember',
    3: 'purple_dust',
    4: 'none',
    5: 'leaf',
    6: 'ripple',
    7: 'moonlight_dust',
    8: 'rain',
    9: 'glow_spot',
    10: 'none',
    11: 'smoke',
    12: 'electric',
    13: 'vortex',
    14: 'bubble',
    15: 'blood_rain',
    16: 'petal',
    17: 'fire_arrow',
    18: 'none',
    19: 'black_dust',
    20: 'bone_mist',
    21: 'ember'
};

// ==========================================================================
// CORE TRANSITIONS & WIDGET CONTROL
// ==========================================================================

// Enter World from Splash
function enterWorld() {
    const landing = document.getElementById('landing-screen');
    if (landing) landing.classList.add('fade-out');
    document.body.classList.remove('landing-active');
    
    // Attempt BGM init
    initBgm();
    
    setTimeout(() => {
        if (landing) landing.style.display = 'none';
        
        // Show bookmark load popup if saved in localstorage
        checkSavedBookmark();
    }, 1200);
}

// Toggle Dropdowns
function toggleSettingsDropdown(event) {
    if (event) event.stopPropagation();
    const settingsDrop = document.getElementById('settings-dropdown');
    settingsDrop.classList.toggle('show');
    
    // Close TOC if open
    const tocDrop = document.getElementById('toc-dropdown');
    if (tocDrop) tocDrop.classList.remove('show');
}

function toggleTocDropdown(event) {
    if (event) event.stopPropagation();
    const tocDrop = document.getElementById('toc-dropdown');
    tocDrop.classList.toggle('show');
    
    // Close Settings if open
    const settingsDrop = document.getElementById('settings-dropdown');
    if (settingsDrop) settingsDrop.classList.remove('show');
}

// Close Dropdowns on Click Outside
window.addEventListener('click', function(e) {
    const settingsDrop = document.getElementById('settings-dropdown');
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsDrop && settingsDrop.classList.contains('show') && 
        !settingsDrop.contains(e.target) && (!settingsBtn || !settingsBtn.contains(e.target))) {
        settingsDrop.classList.remove('show');
    }

    const tocDrop = document.getElementById('toc-dropdown');
    const tocBtn = document.getElementById('toc-btn');
    if (tocDrop && tocDrop.classList.contains('show') && 
        !tocDrop.contains(e.target) && (!tocBtn || !tocBtn.contains(e.target))) {
        tocDrop.classList.remove('show');
    }
});

// Toast Alerts Notification
// Toast Alerts Notification
function showToast(message, icon = '🔖') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    if (toastIcon) toastIcon.textContent = icon;
    document.getElementById('toast-text').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Set Theme
function setTheme(themeName, swatchEl) {
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    if (swatchEl) swatchEl.classList.add('active');
    const isFocusActive = document.body.classList.contains('focus-active');
    const isLandingActive = document.body.classList.contains('landing-active');
    document.body.className = `theme-${themeName}`;
    if (isFocusActive) document.body.classList.add('focus-active');
    if (isLandingActive) document.body.classList.add('landing-active');
    selectedTheme = themeName;
    initParticles();
}

// Set font size levels
function changeFontSize(dir) {
    const steps = ['1.05rem', '1.15rem', '1.25rem', '1.35rem'];
    fontSizeLevel = Math.max(0, Math.min(steps.length - 1, fontSizeLevel + dir));
    
    const r = document.querySelector(':root');
    r.style.setProperty('--font-size-base', steps[fontSizeLevel]);
    r.style.setProperty('--line-height-base', fontSizeLevel >= 2 ? '1.8' : '2');
}

// Keyboard Navigation & Copy Protection (Anti-Copy / Anti-Inspect)
window.addEventListener('keydown', function(e) {
    // 1. Keyboard Navigation (Arrow Keys left/right to change chapters)
    if (e.key === 'ArrowRight') {
        changeChapter(1);
        return;
    } else if (e.key === 'ArrowLeft') {
        changeChapter(-1);
        return;
    } else if (e.key === 'Escape') {
        closeMapModal();
        closeGuideModal();
        return;
    }

    // 2. Anti-Copy & Anti-Inspect Protections
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Block F12 (DevTools)
    if (e.key === 'F12') {
        e.preventDefault();
        showToast("Giao diện nhà phát triển đã bị khóa để bảo vệ tác quyền!", "🛡️");
        return;
    }

    if (isCmdOrCtrl) {
        // Block Ctrl+C / Cmd+C (Copy)
        if (key === 'c' && !e.shiftKey) {
            e.preventDefault();
            showToast("Hành vi sao chép đã bị chặn để bảo vệ tác quyền sử thi!", "🛡️");
            return;
        }
        // Block Ctrl+X / Cmd+X (Cut)
        if (key === 'x') {
            e.preventDefault();
            showToast("Hành vi cắt văn bản đã bị chặn để bảo vệ tác quyền sử thi!", "🛡️");
            return;
        }
        // Block Ctrl+A / Cmd+A (Select All)
        if (key === 'a') {
            e.preventDefault();
            showToast("Hành vi chọn toàn bộ đã bị chặn để bảo vệ nội dung sử thi!", "🛡️");
            return;
        }
        // Block Ctrl+S / Cmd+S (Save Page)
        if (key === 's') {
            e.preventDefault();
            showToast("Lưu bản sao offline đã bị vô hiệu hóa!", "🛡️");
            return;
        }
        // Block Ctrl+P / Cmd+P (Print Page)
        if (key === 'p') {
            e.preventDefault();
            showToast("In trang sử thi đã bị vô hiệu hóa!", "🛡️");
            return;
        }
        // Block Ctrl+U / Cmd+U (View Source)
        if (key === 'u') {
            e.preventDefault();
            showToast("Xem mã nguồn trang đã bị vô hiệu hóa!", "🛡️");
            return;
        }
        // Block Ctrl+Shift+I / J / C (DevTools Inspect)
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
            e.preventDefault();
            showToast("Giao diện nhà phát triển đã bị khóa để bảo vệ tác quyền!", "🛡️");
            return;
        }
    }
});

// Context Menu (Right Click) Prevention
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showToast("Tác phẩm thuộc bản quyền của tác giả Mạnh Quyết. Nghiêm cấm sao chép dưới mọi hình thức!", "🛡️");
});

// Copy / Cut Event Prevention
document.addEventListener('copy', function(e) {
    e.preventDefault();
    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', "Tác phẩm thuộc bản quyền của tác giả Mạnh Quyết. Nghiêm cấm sao chép!");
    }
    showToast("Hành vi sao chép đã bị chặn để bảo vệ tác quyền sử thi!", "🛡️");
});

document.addEventListener('cut', function(e) {
    e.preventDefault();
    showToast("Hành vi cắt văn bản đã bị chặn để bảo vệ tác quyền sử thi!", "🛡️");
});

// Dragstart Prevention (prevents dragging text/illustrations out of window)
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

// ==========================================================================
// RENDER CHAPTERS & TABLE OF CONTENTS
// ==========================================================================

function applyDropCap(text) {
    // Tìm ký tự chữ cái đầu tiên (hỗ trợ cả Unicode tiếng Việt)
    const match = text.match(/\p{L}/u);
    if (!match) return text;
    
    const index = match.index;
    const letter = match[0];
    
    // Trả về chuỗi HTML với ký tự chữ cái đầu tiên được bọc trong span.drop-cap
    return text.substring(0, index) + `<span class="drop-cap">${letter}</span>` + text.substring(index + 1);
}

function renderChapters() {
    const container = document.getElementById('chapters-reading-container');
    container.innerHTML = '';

    if (!window.CHAPTERS_DATA) {
        container.innerHTML = `<p style="padding: 2rem; color: #ef4444; font-family: var(--font-sans)">Dữ liệu tác phẩm chưa được khởi tạo. Vui lòng chạy lại build_novel.py.</p>`;
        return;
    }

    window.CHAPTERS_DATA.forEach(ch => {
        const chDiv = document.createElement('div');
        chDiv.className = 'chapter-container';
        chDiv.id = `chapter-section-${ch.id}`;
        
        const header = document.createElement('h2');
        header.className = 'chapter-header';
        header.textContent = ch.title;
        chDiv.appendChild(header);

        // Render chapter illustration
        if (ILLUSTRATIONS[ch.id]) {
            const img = document.createElement('img');
            img.className = 'chapter-illustration';
            img.src = ILLUSTRATIONS[ch.id].src;
            img.alt = ILLUSTRATIONS[ch.id].alt;
            chDiv.appendChild(img);
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'story-text';

        let firstParaProcessed = false;
        ch.paragraphs.forEach((p, idx) => {
            // Check if paragraph is a section divider (* * *)
            if (/^\s*\*(\s*\*)*\s*$/.test(p.trim())) {
                const dividerDiv = document.createElement('div');
                dividerDiv.className = 'scene-divider';
                dividerDiv.innerHTML = `
                    <svg viewBox="0 0 100 10" width="100%">
                        <path d="M 0,5 L 42,5 L 50,1 L 58,5 L 100,5" fill="none" stroke="var(--theme-primary)" stroke-width="0.5" opacity="0.4"/>
                        <polygon points="50,1 54,5 50,9 46,5" fill="var(--theme-accent)"/>
                    </svg>
                `;
                textDiv.appendChild(dividerDiv);
            } else {
                const pTag = document.createElement('p');
                pTag.id = `ch-${ch.id}-p-${idx}`;
                pTag.style.cursor = 'pointer';
                pTag.title = "Bấm đúp chuột để phát âm thanh từ đoạn này";
                pTag.addEventListener('dblclick', () => {
                    if (currentChapterId === ch.id) {
                        startTTSFromParagraph(idx);
                    }
                });

                if (!firstParaProcessed) {
                    pTag.innerHTML = applyDropCap(p);
                    firstParaProcessed = true;
                } else {
                    pTag.textContent = p;
                }
                textDiv.appendChild(pTag);
            }
        });

        chDiv.appendChild(textDiv);
        container.appendChild(chDiv);
    });

    renderTocList();
}

function renderTocList() {
    const list = document.getElementById('toc-list');
    if (!list) return;
    list.innerHTML = '';
    const saved = localStorage.getItem('winds_novel_bookmark_chapter');

    window.CHAPTERS_DATA.forEach(ch => {
        const item = document.createElement('div');
        item.className = `toc-item ${ch.id === currentChapterId ? 'active' : ''}`;
        item.onclick = () => {
            setActiveChapter(ch.id, true);
            const tocDropdown = document.getElementById('toc-dropdown');
            if (tocDropdown) tocDropdown.classList.remove('show');
        };

        const titleSpan = document.createElement('span');
        titleSpan.textContent = ch.title;
        item.appendChild(titleSpan);

        if (saved && parseInt(saved) === ch.id) {
            const badge = document.createElement('span');
            badge.className = 'toc-bookmark-badge';
            badge.textContent = '🔖';
            badge.title = "Nhấp vào đây để hủy đánh dấu chương này";
            badge.style.cursor = 'pointer';
            badge.style.padding = '2px 6px';
            badge.style.borderRadius = '4px';
            badge.style.transition = 'transform 0.2s';
            
            badge.onmouseover = () => {
                badge.style.transform = 'scale(1.25)';
            };
            badge.onmouseout = () => {
                badge.style.transform = 'scale(1)';
            };
            
            badge.onclick = (e) => {
                e.stopPropagation(); // Ngăn chặn kích hoạt hành động chuyển chương của thẻ cha
                if (confirm("Bạn có chắc chắn muốn hủy bỏ (xóa) đánh dấu trang đã lưu ở chương này không?")) {
                    localStorage.removeItem('winds_novel_bookmark_chapter');
                    localStorage.removeItem('winds_novel_bookmark_paragraph');
                    showToast("Đã hủy đánh dấu thành công!", "🗑️");
                    renderTocList(); // Làm mới mục lục để xóa biểu tượng badge
                }
            };
            
            item.appendChild(badge);
        }

        list.appendChild(item);
    });
}

function setActiveChapter(id, doScroll = true) {
    if (!window.CHAPTERS_DATA || id < 1 || id > window.CHAPTERS_DATA.length) return;
    
    const prevId = currentChapterId;
    currentChapterId = id;
    activeParagraphId = 0; // Reset active paragraph reference

    // Display toggle via classes
    document.querySelectorAll('.chapter-container').forEach(c => c.classList.remove('active-chapter'));
    const activeSec = document.getElementById(`chapter-section-${id}`);
    if (activeSec) {
        activeSec.classList.add('active-chapter');
    }

    // Scroll to top
    if (doScroll) {
        document.getElementById('reader-column').scrollTop = 0;
    }

    // Update Indicators
    document.getElementById('current-chapter-indicator').textContent = `Chương ${id} / ${window.CHAPTERS_DATA.length}`;
    
    // Apply Chapter Theming and Lore Metadata
    const meta = CHAPTER_METADATA[id] || { theme: 'forest', mapGlow: 'akine', loreKey: 'akine' };
    
    // Theme switching
    const isFocusActive = document.body.classList.contains('focus-active');
    const isLandingActive = document.body.classList.contains('landing-active');
    document.body.className = `theme-${meta.theme}`;
    if (isFocusActive) document.body.classList.add('focus-active');
    if (isLandingActive) document.body.classList.add('landing-active');
    selectedTheme = meta.theme;

    // Remove all previous screen effects
    document.body.classList.remove('effect-vignette-gold', 'effect-moonlight', 'effect-noise', 'effect-sunshine', 'effect-dark-mist', 'effect-blood-haze');
    
    // Remove temporary flash and light column overlays if any
    const oldOverlay = document.getElementById('magic-screen-overlay');
    if (oldOverlay) oldOverlay.remove();
    
    // Apply chapter specific screen overlay effects
    if (id === 4) {
        document.body.classList.add('effect-vignette-gold');
    } else if (id === 7) {
        document.body.classList.add('effect-moonlight');
    } else if (id === 11) {
        document.body.classList.add('effect-dark-mist'); // Sương độc u ám của Sieth
    } else if (id === 15) {
        document.body.classList.add('effect-blood-haze'); // Sương máu tế đàn hiến tế
    } else if (id === 18) {
        document.body.classList.add('effect-noise');
    } else if (id === 21) {
        document.body.classList.add('effect-sunshine');
    } else if (id === 10) {
        triggerMagicFlash(); // Lóe sáng khởi đầu khi trứng rồng nứt
    }

    // Highlight map region overview banner and glow marker coordinates dynamically
    const banner = document.getElementById('map-active-region');
    const mapMarker = document.getElementById('map-glow-marker');
    
    if (CHAPTER_LOCATIONS[id]) {
        const loc = CHAPTER_LOCATIONS[id];
        if (banner) {
            banner.innerHTML = `📍 Lãnh địa: ${loc.name}`;
        }
        if (mapMarker) {
            mapMarker.style.left = `${loc.x}%`;
            mapMarker.style.top = `${loc.y}%`;
            mapMarker.style.opacity = '1';
        }
    } else {
        if (banner) banner.innerHTML = `📍 Lãnh địa: Lục địa Nemarian`;
        if (mapMarker) mapMarker.style.opacity = '0';
    }

    // Update Facts widget on chapter switch immediately (excluding initial load sequence)
    if (typeof nextFact === 'function' && factTimer) {
        nextFact();
    }

    // TOC Active indicators syncing
    document.querySelectorAll('.toc-item').forEach((item, idx) => {
        if (idx + 1 === id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Re-initialize dynamic background particles
    initParticles();

    // Text to Speech progress interruption
    if (isTtsActive && prevId !== id) {
        stopTTS();
    }
}

function changeChapter(direction) {
    setActiveChapter(currentChapterId + direction, true);
}

// ==========================================================================
// BACKGROUND MUSIC (BGM ENGINE)
// ==========================================================================

function initBgm() {
    if (!bgmAudio) {
        bgmAudio = new Audio('Assets/Mosslight Path.mp3');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.25; // Gentle background reading volume
    }
}

function toggleSound() {
    const btn = document.getElementById('sound-btn');
    const wave = document.getElementById('sound-wave');
    const txt = document.getElementById('sound-text');
    const icon = document.getElementById('sound-icon');
    
    initBgm();
    
    isAudioPlaying = !isAudioPlaying;
    
    if (isAudioPlaying) {
        bgmAudio.play().then(() => {
            btn.classList.add('active');
            btn.classList.add('playing');
            if (icon) icon.textContent = "🔊";
            if (wave) wave.style.display = "flex";
            txt.textContent = "Nhạc nền";
            showToast("Đã kích hoạt nhạc nền ma pháp Mosslight Path!");
        }).catch(e => {
            console.warn("BGM playback blocked by iOS/browser strict audio interaction policy.", e);
            isAudioPlaying = false;
        });
    } else {
        if (bgmAudio) bgmAudio.pause();
        btn.classList.remove('active');
        btn.classList.remove('playing');
        if (icon) icon.textContent = "🔇";
        if (wave) wave.style.display = "none";
        txt.textContent = "Nhạc nền";
    }
}

// ==========================================================================
// TEXT TO SPEECH (TTS HIGH-FIDELITY VIETNAMESE)
// ==========================================================================

let currentTtsParagraphIndex = -1;
let ttsVoices = [];
let isViTtsSupported = false;
let ttsType = 'local'; // 'local' or 'cloud'
let ttsAudioElement = null;
let ttsQueueTimeout = null;
let audioQueue = [];
let currentQueueIndex = 0;

// Speech speeds mapping (nhịp điệu tăng thêm theo yêu cầu)
const TTS_SPEEDS = [
    { label: '1.0x', cloudRate: 0.98, cloudDelay: 500, localRate: 1.08 },
    { label: '1.15x', cloudRate: 1.12, cloudDelay: 420, localRate: 1.2 },
    { label: '1.3x', cloudRate: 1.25, cloudDelay: 350, localRate: 1.32 },
    { label: '1.5x', cloudRate: 1.45, cloudDelay: 280, localRate: 1.5 },
    { label: '0.85x', cloudRate: 0.85, cloudDelay: 600, localRate: 0.9 }
];
let currentTtsSpeedIdx = 1; // Mặc định là 1.15x để nghe mượt mà, nhanh nhẹn hơn
const savedSpeedIdx = localStorage.getItem('winds_novel_tts_speed_idx');
if (savedSpeedIdx !== null) {
    const parsed = parseInt(savedSpeedIdx);
    if (parsed >= 0 && parsed < TTS_SPEEDS.length) {
        currentTtsSpeedIdx = parsed;
    }
}

function cycleTtsSpeed() {
    currentTtsSpeedIdx = (currentTtsSpeedIdx + 1) % TTS_SPEEDS.length;
    localStorage.setItem('winds_novel_tts_speed_idx', currentTtsSpeedIdx);
    
    const speedBtn = document.getElementById('tts-player-speed');
    if (speedBtn) {
        speedBtn.textContent = TTS_SPEEDS[currentTtsSpeedIdx].label;
    }
    
    showToast(`Tốc độ đọc: ${TTS_SPEEDS[currentTtsSpeedIdx].label}`, "⚡");
    
    if (isTtsActive) {
        // Tái khởi động đọc câu hiện tại với tốc độ mới một cách mượt mà
        readNextParagraph();
    }
}

// Helper to chunk text into smaller fragments (under 180 characters) for cloud TTS compatibility
function chunkText(text, maxLength = 180) {
    // Replace mid-sentence dashes with a comma for a natural narrative pause/breath (instead of period)
    const processedText = text.trim()
        .replace(/(?<!^)(?:\s+[-—–]\s*|\s*[-—–]\s+)/g, ', ');
    
    const sentences = [];
    // 2. Split into sentences based on punctuation (. ! ?)
    const matches = processedText.match(/[^.!?]+[.!?]*/g) || [processedText];
    for (let match of matches) {
        const trimmed = match.trim();
        // Only keep sentences that contain actual narrative text content (letters or numbers)
        if (trimmed && /[a-zA-Z0-9\p{L}]/u.test(trimmed)) {
            sentences.push(trimmed);
        }
    }
    
    // 3. Group sentences into chunks under maxLength
    const chunks = [];
    let currentChunk = "";
    
    for (let sentence of sentences) {
        if ((currentChunk + " " + sentence).length <= maxLength) {
            currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            if (sentence.length > maxLength) {
                const words = sentence.split(" ");
                let subChunk = "";
                for (let word of words) {
                    if ((subChunk + " " + word).length <= maxLength) {
                        subChunk = subChunk ? subChunk + " " + word : word;
                    } else {
                        if (subChunk) chunks.push(subChunk);
                        subChunk = word;
                    }
                }
                if (subChunk) currentChunk = subChunk;
            } else {
                currentChunk = sentence;
            }
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}

// Audio queue player for Google Translate TTS
function playGoogleTtsQueue(chunks, onEnd, onError) {
    if (chunks.length === 0) {
        onEnd();
        return;
    }
    
    audioQueue = chunks;
    currentQueueIndex = 0;
    let retryCount = 0;
    const maxRetries = 2;
    
    function playNext() {
        if (!isTtsActive) return;
        if (currentQueueIndex >= audioQueue.length) {
            onEnd();
            return;
        }
        
        const text = audioQueue[currentQueueIndex];
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(text)}`;
        
        if (ttsAudioElement) {
            ttsAudioElement.pause();
        }
        if (ttsQueueTimeout) {
            clearTimeout(ttsQueueTimeout);
            ttsQueueTimeout = null;
        }
        
        ttsAudioElement = document.createElement('audio');
        ttsAudioElement.referrerPolicy = "no-referrer";
        ttsAudioElement.src = url;
        
        // Calibrate playback speed dynamically based on active speed level configuration
        const speedCfg = TTS_SPEEDS[currentTtsSpeedIdx];
        ttsAudioElement.defaultPlaybackRate = speedCfg.cloudRate;
        ttsAudioElement.playbackRate = speedCfg.cloudRate;
        
        ttsAudioElement.addEventListener('loadedmetadata', () => {
            ttsAudioElement.playbackRate = speedCfg.cloudRate;
        });
        
        ttsAudioElement.addEventListener('ended', () => {
            retryCount = 0; // Reset retry count on success
            // Introduce breathing delay based on active speed level configuration
            ttsQueueTimeout = setTimeout(() => {
                if (isTtsActive) {
                    currentQueueIndex++;
                    playNext();
                }
            }, speedCfg.cloudDelay);
        });
        
        ttsAudioElement.addEventListener('error', (e) => {
            console.error("Google TTS error:", e);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying chunk ${currentQueueIndex} (Attempt ${retryCount}/${maxRetries})...`);
                ttsQueueTimeout = setTimeout(playNext, 1000); // Wait 1s before retrying
            } else {
                onError();
            }
        });
        
        ttsAudioElement.play().catch(err => {
            console.warn("Audio play blocked or failed:", err);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying play chunk ${currentQueueIndex} (Attempt ${retryCount}/${maxRetries})...`);
                ttsQueueTimeout = setTimeout(playNext, 1000);
            } else {
                onError();
            }
        });
    }
    
    playNext();
}


let voiceAttempts = 0;
function initVoices() {
    const voiceSelect = document.getElementById('tts-voice-select');
    const ttsBtn = document.getElementById('tts-btn');
    if (!voiceSelect || !ttsBtn) return;

    if (!('speechSynthesis' in window)) {
        // Fallback to Cloud Google TTS if SpeechSynthesis is not supported
        ttsType = 'cloud';
        isViTtsSupported = true;
        voiceSelect.innerHTML = '<option value="cloud-vi">🔊 Giọng đọc đám mây (Google vi-VN)</option>';
        ttsBtn.classList.remove('disabled');
        ttsBtn.textContent = "Đọc truyện";
        ttsBtn.title = "Đọc truyện bằng giọng nói đám mây trực tuyến";
        return;
    }
    
    ttsVoices = window.speechSynthesis.getVoices();
    
    // Async loading of voices on some devices (e.g. Chrome, Android, iOS Safari)
    if (ttsVoices.length === 0 && voiceAttempts < 10) {
        voiceAttempts++;
        setTimeout(initVoices, 250);
        return;
    }
    
    voiceSelect.innerHTML = '';

    const viVoices = ttsVoices.filter(v => {
        const lang = v.lang.toLowerCase();
        return lang.startsWith('vi') || lang.includes('-vi') || lang.includes('_vi');
    });

    // Sắp xếp ưu tiên các giọng đọc Online chất lượng cao (như Microsoft Online/Natural voices trên Edge)
    viVoices.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aOnline = aName.includes('online') || aName.includes('natural');
        const bOnline = bName.includes('online') || bName.includes('natural');
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return 0;
    });

    if (viVoices.length > 0) {
        ttsType = 'local';
        isViTtsSupported = true;
        
        const optGroupVi = document.createElement('optgroup');
        optGroupVi.label = "Giọng đọc hệ thống (Khuyên dùng)";
        viVoices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name} (${v.lang})`;
            optGroupVi.appendChild(opt);
        });
        voiceSelect.appendChild(optGroupVi);
        
        // Restore saved preference if valid
        const savedVoice = localStorage.getItem('winds_novel_tts_voice');
        if (savedVoice && viVoices.some(v => v.name === savedVoice)) {
            voiceSelect.value = savedVoice;
        } else {
            voiceSelect.value = viVoices[0].name;
        }
        
        ttsBtn.classList.remove('disabled');
        ttsBtn.textContent = "Đọc truyện";
        ttsBtn.title = "Đọc truyện bằng giọng nói AI tiếng Việt có sẵn";
    } else {
        // Fallback to Cloud Google TTS if no local Vietnamese voice pack exists
        ttsType = 'cloud';
        isViTtsSupported = true;
        
        const opt = document.createElement('option');
        opt.value = "cloud-vi";
        opt.textContent = "🔊 Giọng đọc đám mây (Google vi-VN)";
        voiceSelect.appendChild(opt);
        
        ttsBtn.classList.remove('disabled');
        ttsBtn.textContent = "Đọc truyện";
        ttsBtn.title = "Đọc truyện bằng giọng nói đám mây trực tuyến";
    }
}

// Voice setup triggers
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = initVoices;
    setTimeout(initVoices, 100);
    
    document.addEventListener('DOMContentLoaded', () => {
        const voiceSelect = document.getElementById('tts-voice-select');
        if (voiceSelect) {
            voiceSelect.addEventListener('change', () => {
                localStorage.setItem('winds_novel_tts_voice', voiceSelect.value);
                if (isTtsActive) {
                    readNextParagraph();
                }
            });
        }
    });
} else {
    // If no speechSynthesis, run initVoices for cloud options on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initVoices);
}

function toggleTTS() {
    if (!isViTtsSupported) {
        showToast("Thiết bị hoặc trình duyệt của bạn không hỗ trợ giọng đọc Tiếng Việt!", "🛡️");
        return;
    }

    if (isTtsActive) {
        pauseTTS();
    } else {
        startTTS();
    }
}

function updateTtsHud() {
    const hud = document.getElementById('tts-player-toast');
    const playPauseBtn = document.getElementById('tts-player-play-pause');
    const titleEl = document.getElementById('tts-player-title');
    const subtitleEl = document.getElementById('tts-player-subtitle');
    
    if (!hud) return;
    
    // Sync speed label on floating HUD
    const speedBtn = document.getElementById('tts-player-speed');
    if (speedBtn) {
        speedBtn.textContent = TTS_SPEEDS[currentTtsSpeedIdx].label;
    }
    
    if (isTtsActive) {
        hud.classList.add('show');
        if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        
        const currentChData = window.CHAPTERS_DATA.find(c => c.id === currentChapterId);
        if (currentChData) {
            if (titleEl) {
                // Truncate chapter title if it's too long to keep HUD looking premium
                const fullTitle = `Chương ${currentChapterId}: ${currentChData.title}`;
                titleEl.textContent = fullTitle.length > 34 ? fullTitle.substring(0, 32) + "..." : fullTitle;
            }
            if (subtitleEl) {
                subtitleEl.textContent = `Đoạn ${currentTtsParagraphIndex + 1} / ${currentChData.paragraphs.length}`;
            }
        }
    } else {
        // Tts is inactive (either paused or stopped)
        if (currentTtsParagraphIndex !== -1) {
            // Paused state
            hud.classList.add('show');
            if (playPauseBtn) playPauseBtn.textContent = '▶️';
            
            const currentChData = window.CHAPTERS_DATA.find(c => c.id === currentChapterId);
            if (currentChData && subtitleEl) {
                subtitleEl.textContent = `Đoạn ${currentTtsParagraphIndex + 1} / ${currentChData.paragraphs.length} (Đã tạm dừng)`;
            }
        } else {
            // Stopped state
            hud.classList.remove('show');
        }
    }
}

function startTTS() {
    isTtsActive = true;
    const btn = document.getElementById('tts-btn');
    const indicator = document.getElementById('speech-indicator');
    
    if (btn) btn.textContent = "Tạm dừng";
    if (indicator) {
        indicator.classList.add('active');
        indicator.textContent = ttsType === 'local' ? "🔊 Đang phát giọng đọc hệ thống..." : "🔊 Đang phát giọng đọc đám mây...";
    }

    if (currentTtsParagraphIndex === -1) {
        currentTtsParagraphIndex = activeParagraphId || 0;
    }

    updateTtsHud();
    readNextParagraph();
}

function pauseTTS() {
    isTtsActive = false;
    if (ttsType === 'local') {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    } else {
        if (ttsAudioElement) {
            ttsAudioElement.pause();
        }
    }
    if (ttsQueueTimeout) {
        clearTimeout(ttsQueueTimeout);
        ttsQueueTimeout = null;
    }
    const btn = document.getElementById('tts-btn');
    const indicator = document.getElementById('speech-indicator');
    
    if (btn) btn.textContent = "Tiếp tục đọc";
    if (indicator) indicator.classList.remove('active');
    
    updateTtsHud();
}

function stopTTS() {
    isTtsActive = false;
    currentTtsParagraphIndex = -1;
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (ttsAudioElement) {
        ttsAudioElement.pause();
        ttsAudioElement = null;
    }
    if (ttsQueueTimeout) {
        clearTimeout(ttsQueueTimeout);
        ttsQueueTimeout = null;
    }
    const btn = document.getElementById('tts-btn');
    const indicator = document.getElementById('speech-indicator');
    
    if (btn) btn.textContent = "Đọc truyện";
    if (indicator) indicator.classList.remove('active');
    
    // Clear paragraph highlight
    document.querySelectorAll('.story-text p').forEach(p => p.classList.remove('reading-highlight'));
    
    updateTtsHud();
}

function startTTSFromParagraph(pIdx) {
    if (!isViTtsSupported) {
        showToast("Thiết bị hoặc trình duyệt của bạn không hỗ trợ giọng đọc Tiếng Việt!", "🛡️");
        return;
    }

    stopTTS();
    isTtsActive = true;
    currentTtsParagraphIndex = pIdx;
    
    const btn = document.getElementById('tts-btn');
    const indicator = document.getElementById('speech-indicator');
    if (btn) btn.textContent = "Tạm dừng";
    if (indicator) {
        indicator.classList.add('active');
        indicator.textContent = ttsType === 'local' ? "🔊 Đang phát giọng đọc hệ thống..." : "🔊 Đang phát giọng đọc đám mây...";
    }

    updateTtsHud();
    readNextParagraph();
}

function readNextParagraph() {
    if (!isTtsActive) return;
    
    // Cancel any active audio
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (ttsAudioElement) {
        ttsAudioElement.pause();
        ttsAudioElement = null;
    }
    if (ttsQueueTimeout) {
        clearTimeout(ttsQueueTimeout);
        ttsQueueTimeout = null;
    }

    const currentChData = window.CHAPTERS_DATA.find(c => c.id === currentChapterId);
    if (!currentChData || currentTtsParagraphIndex >= currentChData.paragraphs.length) {
        // If finished this chapter, switch to next chapter
        if (currentChapterId < window.CHAPTERS_DATA.length) {
            showToast("Hết chương! Tự động chuyển sang chương sau...");
            setActiveChapter(currentChapterId + 1, true);
            setTimeout(() => {
                startTTSFromParagraph(0);
            }, 1000);
        } else {
            showToast("Đã hoàn thành toàn bộ sử thi!");
            stopTTS();
        }
        return;
    }

    const pText = currentChData.paragraphs[currentTtsParagraphIndex];
    
    // Handle scene separator stars by skipping
    if (/^\s*\*(\s*\*)*\s*$/.test(pText.trim())) {
        currentTtsParagraphIndex++;
        readNextParagraph();
        return;
    }

    // Scroll to the active paragraph
    const pEl = document.getElementById(`ch-${currentChapterId}-p-${currentTtsParagraphIndex}`);
    if (pEl) {
        pEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight active text line
        document.querySelectorAll('.story-text p').forEach(p => p.classList.remove('reading-highlight'));
        pEl.classList.add('reading-highlight');
    }

    // Update HUD display values
    updateTtsHud();

    if (ttsType === 'local') {
        // --- LOCAL SPEECH SYNTHESIS ENGINE ---
        // Replace mid-sentence dashes with a comma for a natural narrative pause/breath (instead of period)
        const preprocessedText = pText.trim()
            .replace(/(?<!^)(?:\s+[-—–]\s*|\s*[-—–]\s+)/g, ', ');
            
        ttsUtterance = new SpeechSynthesisUtterance(preprocessedText);
        
        const selectedVoiceName = document.getElementById('tts-voice-select').value;
        const ttsVoices = window.speechSynthesis.getVoices();
        let selectedVoice = ttsVoices.find(v => v.name === selectedVoiceName);
        
        // Ensure voice is Vietnamese, otherwise fall back
        if (!selectedVoice || !selectedVoice.lang.toLowerCase().includes('vi')) {
            const viVoices = ttsVoices.filter(v => {
                const lang = v.lang.toLowerCase();
                return lang.startsWith('vi') || lang.includes('-vi') || lang.includes('_vi');
            });
            viVoices.sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                const aOnline = aName.includes('online') || aName.includes('natural');
                const bOnline = bName.includes('online') || bName.includes('natural');
                if (aOnline && !bOnline) return -1;
                if (!aOnline && bOnline) return 1;
                return 0;
            });
            if (viVoices.length > 0) {
                selectedVoice = viVoices[0];
            }
        }

        if (selectedVoice) {
            ttsUtterance.voice = selectedVoice;
        } else {
            // Local voice failed/missing, fallback to Cloud
            ttsType = 'cloud';
            readNextParagraph();
            return;
        }
        
        const speedCfg = TTS_SPEEDS[currentTtsSpeedIdx];
        ttsUtterance.rate = speedCfg.localRate;
        ttsUtterance.pitch = 1.0;

        ttsUtterance.onend = function() {
            if (isTtsActive) {
                currentTtsParagraphIndex++;
                readNextParagraph();
            }
        };

        ttsUtterance.onerror = function(event) {
            if (event.error !== 'interrupted') {
                console.error("Speech Synthesis Error:", event);
                // Switch to cloud on local failure
                ttsType = 'cloud';
                readNextParagraph();
            }
        };

        window.speechSynthesis.speak(ttsUtterance);
    } else {
        // --- CLOUD GOOGLE TTS ENGINE ---
        const chunks = chunkText(pText, 180);
        
        playGoogleTtsQueue(chunks, () => {
            if (isTtsActive) {
                currentTtsParagraphIndex++;
                readNextParagraph();
            }
        }, () => {
            if (!navigator.onLine) {
                showToast("Không có kết nối mạng! Vui lòng kiểm tra internet để tiếp tục sử dụng giọng đọc đám mây.", "📶");
            } else {
                showToast("Dịch vụ đọc cloud hiện không khả dụng (quá tải hoặc bị chặn). Vui lòng thử lại sau!", "🛡️");
            }
            stopTTS();
        });
    }
}

// ==========================================================================
// AUTOSCROLL MECHANICS
// ==========================================================================

function toggleAutoScroll() {
    isAutoScrolling = !isAutoScrolling;
    const btn = document.getElementById('autoscroll-btn');
    
    if (isAutoScrolling) {
        btn.classList.add('active');
        btn.textContent = "TẮT";
        startAutoScrollLoop();
        showToast("Đã kích hoạt tự động cuộn sử thi!");
    } else {
        btn.classList.remove('active');
        btn.textContent = "BẬT";
        stopAutoScrollLoop();
    }
}

function startAutoScrollLoop() {
    stopAutoScrollLoop();
    const scrollContainer = document.getElementById('reader-column');
    
    // Smooth scrolling delta metrics
    autoScrollTimer = setInterval(() => {
        if (scrollContainer) {
            scrollContainer.scrollTop += 1;
        }
    }, 45); // Gentle scrolling step speed
}

function stopAutoScrollLoop() {
    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
    }
}

// ==========================================================================
// BOOKMARK SYSTEM (LOCAL STORAGE BASED)
// ==========================================================================

function trackActiveParagraph() {
    const reader = document.getElementById('reader-column');
    if (!reader) return;
    
    const activeChapterSec = document.getElementById(`chapter-section-${currentChapterId}`);
    if (!activeChapterSec) return;
    
    const paragraphs = activeChapterSec.querySelectorAll('.story-text p');
    if (paragraphs.length === 0) return;
    
    const readerRect = reader.getBoundingClientRect();
    const centerY = readerRect.top + readerRect.height / 3; // Focus 1/3 down viewport
    
    let closestParaIdx = 0;
    let closestDist = Infinity;
    
    paragraphs.forEach((p, idx) => {
        const rect = p.getBoundingClientRect();
        const dist = Math.abs(rect.top - centerY);
        if (dist < closestDist) {
            closestDist = dist;
            closestParaIdx = idx;
        }
    });
    
    activeParagraphId = closestParaIdx;
}

function saveBookmark() {
    trackActiveParagraph();
    localStorage.setItem('winds_novel_bookmark_chapter', currentChapterId);
    localStorage.setItem('winds_novel_bookmark_paragraph', activeParagraphId);
    showToast(`Đã ghi nhớ ấn ký: Chương ${currentChapterId} - Đoạn ${activeParagraphId + 1}!`, "🔖");
    renderTocList();
}

function checkSavedBookmark() {
    const savedChapter = localStorage.getItem('winds_novel_bookmark_chapter');
    const savedParagraph = localStorage.getItem('winds_novel_bookmark_paragraph');
    
    if (savedChapter) {
        const chNum = parseInt(savedChapter);
        const pNum = savedParagraph ? parseInt(savedParagraph) : 0;
        
        if (confirm(`Tìm thấy ấn ký Chương ${chNum} - Đoạn ${pNum + 1} hành trình cũ. Tiếp tục hành trình?`)) {
            setActiveChapter(chNum, false);
            
            setTimeout(() => {
                const pEl = document.getElementById(`ch-${chNum}-p-${pNum}`);
                if (pEl) {
                    pEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    pEl.classList.add('bookmark-highlight');
                    setTimeout(() => {
                        pEl.classList.remove('bookmark-highlight');
                    }, 4000);
                }
            }, 300);
        }
    }
}

// ==========================================================================
// BACKGROUND MAGIC PARTICLE SYSTEM
// ==========================================================================

function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
}

class Particle {
    constructor(type) {
        this.type = type;
        this.reset();
        // Scatter particles initially with random states to avoid synchronized fade-ins
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.alpha = Math.random() * this.maxAlpha;
        this.fadeState = Math.random() > 0.5 ? 'in' : 'out';
    }

    reset() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.8;
        this.color = '#ffffff';
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.5 + 0.2;
        this.fadeState = 'in';
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        
        switch(this.type) {
            case 'firefly':
                this.color = `hsla(${55 + Math.random()*15}, 100%, 75%, 1)`; // Vàng chanh nhạt mờ ảo
                this.size = Math.random() * 3.2 + 1.2;
                this.speedX = Math.random() * 0.35 - 0.175;
                this.speedY = Math.random() * 0.35 - 0.175;
                this.maxAlpha = Math.random() * 0.45 + 0.15;
                this.fadeSpeed = Math.random() * 0.004 + 0.002;
                break;
            case 'ember':
                this.color = Math.random() > 0.5 ? '#ef4444' : '#f97316'; // Đỏ hoặc Cam
                this.x = Math.random() * canvasWidth;
                this.y = canvasHeight + 10;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = -(Math.random() * 1.3 + 0.6); // Bay ngược lên
                this.maxAlpha = Math.random() * 0.65 + 0.25;
                this.fadeSpeed = Math.random() * 0.008 + 0.004;
                break;
            case 'purple_dust':
                this.color = Math.random() > 0.5 ? '#e9d5ff' : '#d8b4fe'; // Tím nhạt rơi chậm
                this.y = -10;
                this.size = Math.random() * 1.8 + 0.8;
                this.speedX = Math.random() * 0.15 - 0.075;
                this.speedY = Math.random() * 0.5 + 0.25;
                this.maxAlpha = Math.random() * 0.55 + 0.15;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                break;
            case 'moonlight_dust':
                this.color = '#f1f5f9'; // Trắng bạc dịu mát
                this.y = -10;
                this.x = Math.random() * canvasWidth;
                this.size = Math.random() * 2.8 + 1.2;
                this.speedX = Math.random() * 0.35 + 0.1; // Trôi nhẹ sang phải
                this.speedY = Math.random() * 0.35 + 0.2; // Rơi rất chậm
                this.maxAlpha = Math.random() * 0.65 + 0.25;
                this.fadeSpeed = Math.random() * 0.004 + 0.002;
                this.swingSpeed = Math.random() * 0.02 + 0.01;
                this.swingRange = Math.random() * 1.2 + 0.5;
                this.swingTime = Math.random() * 100;
                break;
            case 'leaf':
                this.color = Math.random() > 0.5 ? '#10b981' : '#34d399'; // Xanh lá cây
                this.x = -50;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * 18 + 10; // Độ dài line lướt ngang
                this.speedX = Math.random() * 2.5 + 1.8;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.maxAlpha = Math.random() * 0.25 + 0.08;
                this.fadeSpeed = 0.008;
                break;
            case 'ripple':
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.size = 2; // Bán kính
                this.maxSize = Math.random() * 100 + 60; // Lan rộng hơn lãng mạn
                this.speedSize = Math.random() * 0.6 + 0.4;
                this.color = 'rgba(191, 219, 254, 0.45)'; // Xanh lam bạc rõ hơn
                this.maxAlpha = Math.random() * 0.4 + 0.25; // Sáng rõ
                this.alpha = this.maxAlpha;
                this.fadeSpeed = 0.004;
                this.fadeState = 'out';
                break;
            case 'rain':
                this.color = 'rgba(148, 163, 184, 0.35)'; // Mưa rơi xám
                this.y = -20;
                this.x = Math.random() * (canvasWidth + 200) - 100;
                this.size = Math.random() * 1.2 + 0.6; // Độ dày nét vẽ
                this.speedX = -2.0; // Rơi nghiêng
                this.speedY = Math.random() * 7 + 7;
                this.maxAlpha = Math.random() * 0.45 + 0.15;
                this.alpha = this.maxAlpha;
                break;
            case 'glow_spot':
                this.color = Math.random() > 0.5 ? '#d8b4fe' : '#c084fc';
                this.size = Math.random() * 7 + 3;
                this.speedX = Math.random() * 0.18 - 0.09;
                this.speedY = Math.random() * 0.18 - 0.09;
                this.maxAlpha = Math.random() * 0.35 + 0.1;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
                this.growDir = 1;
                break;
            case 'smoke':
                this.color = 'rgba(15, 23, 42, 0.85)'; // Sương khói u ám bao bao phủ
                this.size = Math.random() * 130 + 80; // Volumetric smoke to bồng bềnh
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.2 - 0.1;
                this.maxAlpha = Math.random() * 0.16 + 0.06;
                this.fadeSpeed = Math.random() * 0.0015 + 0.0006;
                break;
            case 'electric':
                this.color = '#22d3ee'; // Xanh neon dây điện
                this.size = Math.random() * 2.5 + 0.8;
                this.speedX = Math.random() * 1.8 - 0.9;
                this.speedY = Math.random() * 1.8 - 0.9;
                this.maxAlpha = Math.random() * 0.75 + 0.15;
                this.fadeSpeed = Math.random() * 0.04 + 0.015;
                break;
            case 'vortex':
                this.color = 'rgba(248, 250, 252, 0.65)'; // Vòng xoáy trắng
                this.size = Math.random() * 1.8 + 0.6;
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.45 + 15;
                this.angularSpeed = Math.random() * 0.018 + 0.004;
                this.radialSpeed = -(Math.random() * 0.4 + 0.08);
                break;
            case 'bubble':
                this.color = Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(168, 85, 247, 0.25)'; // Bong bóng lam + sét tím
                this.y = canvasHeight + 10;
                this.size = Math.random() * 5 + 1.5;
                this.speedX = Math.random() * 0.35 - 0.175;
                this.speedY = -(Math.random() * 1.1 + 0.3);
                this.maxAlpha = Math.random() * 0.55 + 0.15;
                this.fadeSpeed = 0.0045;
                break;
            case 'blood_rain':
                this.color = 'rgba(220, 38, 38, 0.75)'; // Mưa máu đỏ tươi tương phản cao
                this.y = -20;
                this.x = Math.random() * (canvasWidth + 200) - 100;
                this.size = Math.random() * 1.8 + 0.8; // Dày dặn
                this.speedX = -1.2;
                this.speedY = Math.random() * 8 + 7; // Rơi xối xả nhanh mạnh
                this.maxAlpha = Math.random() * 0.65 + 0.3;
                this.alpha = this.maxAlpha;
                break;
            case 'petal':
                this.color = Math.random() > 0.5 ? '#f472b6' : '#fecdd3'; // Cánh hoa đào rơi lả tả
                this.y = -10;
                this.x = Math.random() * canvasWidth;
                this.size = Math.random() * 4.5 + 2.5;
                this.speedX = Math.random() * 0.75 + 0.35; // Rơi nghiêng phải
                this.speedY = Math.random() * 0.75 + 0.45;
                this.maxAlpha = Math.random() * 0.65 + 0.25;
                this.fadeSpeed = Math.random() * 0.0035 + 0.0015;
                this.swingSpeed = Math.random() * 0.035 + 0.015;
                this.swingRange = Math.random() * 1.8 + 0.8;
                this.swingTime = Math.random() * 100;
                break;
            case 'fire_arrow':
                this.color = '#ef4444'; // Mũi tên lửa đỏ lướt nhanh
                this.x = canvasWidth + 100;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * 40 + 25; // Chiều dài thon gọn hơn
                this.speedX = -(Math.random() * 4 + 3.5); // Bay chậm dịu nhẹ hơn
                this.speedY = Math.random() * 0.2 - 0.1;
                this.maxAlpha = Math.random() * 0.18 + 0.08; // Rất mờ nhẹ phía sau chữ
                this.alpha = this.maxAlpha;
                break;
            case 'black_dust':
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.size = Math.random() * 3 + 1.2;
                this.color = '#020617'; // Màu đen tà khí sa đọa
                this.maxAlpha = Math.random() * 0.65 + 0.3;
                this.alpha = this.maxAlpha;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.evaporated = false;
                break;
            case 'bone_mist':
                this.color = Math.random() > 0.55 ? '#f8fafc' : '#059669'; // Xương trắng + sương lục bảo
                this.size = Math.random() * 2.6 + 0.8;
                this.speedX = Math.random() * 0.75 - 0.375;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.maxAlpha = Math.random() * 0.55 + 0.15;
                this.fadeSpeed = Math.random() * 0.0048 + 0.0018;
                break;
            default:
                this.color = '#ffffff';
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = Math.random() * 0.2 - 0.1;
                this.maxAlpha = Math.random() * 0.5 + 0.2;
                this.fadeSpeed = Math.random() * 0.003 + 0.001;
        }
    }

    update() {
        switch(this.type) {
            case 'leaf':
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvasWidth + 50) this.reset();
                break;
            case 'ripple':
                this.size += this.speedSize;
                this.alpha -= this.fadeSpeed;
                if (this.alpha <= 0 || this.size >= this.maxSize) this.reset();
                break;
            case 'rain':
            case 'blood_rain':
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.y > canvasHeight + 20 || this.x < -50) this.reset();
                break;
            case 'vortex':
                this.angle += this.angularSpeed;
                this.radius += this.radialSpeed;
                this.x = canvasWidth / 2 + Math.cos(this.angle) * this.radius;
                this.y = canvasHeight / 2 + Math.sin(this.angle) * this.radius;
                if (this.radius <= 5) this.reset();
                break;
            case 'fire_arrow':
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < -100) this.reset();
                break;
            case 'petal':
                this.swingTime += this.swingSpeed;
                this.x += this.speedX + Math.sin(this.swingTime) * this.swingRange;
                this.y += this.speedY;
                if (this.y > canvasHeight + 10 || this.x > canvasWidth + 10) this.reset();
                break;
            case 'moonlight_dust':
                this.swingTime += this.swingSpeed;
                this.x += this.speedX + Math.sin(this.swingTime) * this.swingRange;
                this.y += this.speedY;
                if (this.y > canvasHeight + 10 || this.x > canvasWidth + 10) this.reset();
                break;
            case 'black_dust':
                if (sanctifyingScanActive && this.x < sanctifyingScanX) {
                    this.evaporated = true;
                }
                if (this.evaporated) {
                    this.y += -(Math.random() * 3.5 + 1.5); // Bay vút lên nhanh
                    this.x += Math.random() * 0.8 - 0.4;    // Rung động hỗn loạn nhẹ
                    this.alpha -= 0.018;                    // Mờ dần rồi bay biến
                    if (this.alpha <= 0) {
                        this.alpha = 0;
                    }
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                    if (this.x < -10 || this.x > canvasWidth + 10 || this.y < -10 || this.y > canvasHeight + 10) {
                        this.reset();
                    }
                }
                break;
            case 'glow_spot':
                this.x += this.speedX;
                this.y += this.speedY;
                this.size += this.growDir * 0.045;
                if (this.size >= 11) this.growDir = -1;
                if (this.size <= 3.5) this.growDir = 1;
                
                if (this.fadeState === 'in') {
                    this.alpha += this.fadeSpeed;
                    if (this.alpha >= this.maxAlpha) this.fadeState = 'out';
                } else {
                    this.alpha -= this.fadeSpeed;
                    if (this.alpha <= 0) this.reset();
                }
                break;
            default:
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.fadeState === 'in') {
                    this.alpha += this.fadeSpeed;
                    if (this.alpha >= this.maxAlpha) {
                        this.alpha = this.maxAlpha;
                        this.fadeState = 'out';
                    }
                } else if (this.fadeState === 'out') {
                    this.alpha -= this.fadeSpeed;
                    if (this.alpha <= 0) {
                        this.alpha = 0;
                        this.reset();
                    }
                }
        }

        if (this.type !== 'vortex' && this.type !== 'leaf' && this.type !== 'rain' && this.type !== 'blood_rain' && this.type !== 'fire_arrow' && this.type !== 'petal' && this.type !== 'moonlight_dust' && this.type !== 'black_dust') {
            if (this.x < -50 || this.x > canvasWidth + 50 || this.y < -50 || this.y > canvasHeight + 50) {
                this.reset();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.type === 'rain' || this.type === 'blood_rain') {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speedX * 1.5, this.y + this.speedY * 1.5);
            ctx.stroke();
        } else if (this.type === 'leaf') {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.3;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.stroke();
        } else if (this.type === 'fire_arrow') {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2.2;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.stroke();
        } else if (this.type === 'ripple') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.6; // Nét vẽ sóng nước dày dặn rõ nét hơn
            ctx.stroke();
        } else if (this.type === 'electric') {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.moveTo(this.x, this.y);
            let targetX = this.x + this.speedX * 15 + (Math.random() * 12 - 6);
            let targetY = this.y + this.speedY * 15 + (Math.random() * 12 - 6);
            ctx.lineTo(targetX, targetY);
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.stroke();
        } else if (this.type === 'bubble') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.color.includes('56, 189, 248')) {
                // Bong bóng nước xanh lam nhạt: vẽ viền mỏng sáng và một điểm bóng nhỏ ở góc trên bên trái
                ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
                ctx.lineWidth = 0.8;
                ctx.stroke();
                ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
                ctx.fill();
                
                // Điểm sáng phản chiếu của bong bóng
                ctx.beginPath();
                ctx.arc(this.x - this.size * 0.35, this.y - this.size * 0.35, this.size * 0.15, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            } else {
                // Tia sét/hạt lôi điện tím phát sáng rực rỡ
                ctx.fillStyle = '#e879f9';
                ctx.shadowBlur = this.size * 2.5;
                ctx.shadowColor = '#d946ef';
                ctx.fill();
            }
        } else if (this.type === 'smoke') {
            // Khói đen thể tích: vẽ bằng Radial Gradient để các rìa khói bồng bềnh mờ dần tự nhiên
            let smokeGrad = ctx.createRadialGradient(this.x, this.y, this.size * 0.05, this.x, this.y, this.size);
            smokeGrad.addColorStop(0, `rgba(15, 23, 42, ${this.alpha * 0.95})`);
            smokeGrad.addColorStop(0.5, `rgba(30, 41, 59, ${this.alpha * 0.4})`);
            smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = smokeGrad;
            ctx.fill();
        } else if (this.type === 'black_dust') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.evaporated) {
                // Đang bốc cháy càn quét: hạt sáng lên màu cam/đỏ tàn tro nhấp nháy phát sáng
                ctx.fillStyle = Math.random() > 0.5 ? '#f97316' : '#ef4444';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#f97316';
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;

            if (this.type === 'firefly' || this.type === 'ember' || this.type === 'glow_spot' || this.type === 'bone_mist' || this.type === 'purple_dust' || this.type === 'moonlight_dust') {
                ctx.shadowBlur = this.size * 2.2;
                ctx.shadowColor = this.color;
            }
            ctx.fill();
        }
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    
    // Reset và xóa các trạng thái thời tiết ma thuật đặc biệt
    eggCracks = [];
    sanctifyingScanActive = false;
    
    if (!particlesEnabled) return;

    const weatherType = CHAPTER_WEATHER_TYPES[currentChapterId] || 'default';
    
    // Khởi tạo các vết nứt trứng rồng nếu ở chương 10
    if (currentChapterId === 10) {
        generateEggCracks();
    }
    
    // Kích hoạt dải sáng Thần quang càn quét nếu ở chương 19
    if (currentChapterId === 19) {
        sanctifyingScanActive = true;
        sanctifyingScanX = -200;
    }

    if (weatherType === 'none') return; // Canvas trống, hiệu ứng đặc biệt xử lý bằng DOM Overlay

    let count = 55;
    if (weatherType === 'rain') count = 110;
    if (weatherType === 'blood_rain') count = 160; // Tăng mật độ cho bão mưa máu chương 15
    if (weatherType === 'smoke') count = 18;
    if (weatherType === 'electric') count = 25;
    if (weatherType === 'vortex') count = 75;
    if (weatherType === 'fire_arrow') count = 5; // Tiết chế tối đa 5 mũi tên lửa tránh rối mắt
    if (weatherType === 'black_dust') count = 60; // 60 hạt tà khí đen bị thiêu rụi chương 19
    if (weatherType === 'moonlight_dust') count = 45; // 45 hạt bụi trăng nhẹ nhàng lấp lánh chương 7

    for (let i = 0; i < count; i++) {
        particles.push(new Particle(weatherType));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (particlesEnabled) {
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Vẽ "Nhịp đập vàng & Vết nứt trứng" cho Chương 10
        if (currentChapterId === 10) {
            drawGoldenEggPulse();
        }
        
        // Vẽ dải quét "Thần quang thanh tẩy" cho Chương 19
        if (currentChapterId === 19) {
            drawSanctifyingScan();
        }
    }

    requestAnimationFrame(animateParticles);
}

// --------------------------------------------------------------------------
// HÀM HỖ TRỢ HIỆU ỨNG THỜI TIẾT MA THUẬT ĐẶC BIỆT (CHƯƠNG 10 & 19)
// --------------------------------------------------------------------------

function generateEggCracks() {
    eggCracks = [];
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const mainBranches = 6 + Math.floor(Math.random() * 4); // 6-9 nhánh nứt chính
    
    for (let i = 0; i < mainBranches; i++) {
        let angle = (i / mainBranches) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        let segments = 3 + Math.floor(Math.random() * 3); // 3-5 phân đoạn mỗi nhánh
        let startX = centerX;
        let startY = centerY;
        let currentRad = 0;
        
        for (let j = 0; j < segments; j++) {
            currentRad += Math.random() * 35 + 15;
            let segmentAngle = angle + (Math.random() * 0.5 - 0.25);
            let endX = centerX + Math.cos(segmentAngle) * currentRad;
            let endY = centerY + Math.sin(segmentAngle) * currentRad;
            
            eggCracks.push({
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY
            });
            
            // Tạo nhánh phụ chân chim
            if (Math.random() > 0.55) {
                let subAngle = segmentAngle + (Math.random() > 0.5 ? 0.6 : -0.6);
                let subEndX = endX + Math.cos(subAngle) * (currentRad * 0.35);
                let subEndY = endY + Math.sin(subAngle) * (currentRad * 0.35);
                eggCracks.push({
                    startX: endX,
                    startY: endY,
                    endX: subEndX,
                    endY: subEndY
                });
            }
            
            startX = endX;
            startY = endY;
        }
    }
}

function drawGoldenEggPulse() {
    let time = Date.now() * 0.0022; // Nhịp tim chậm rãi, tự nhiên
    let pulse = (Math.sin(time) + 1) / 2; // Vòng tuần hoàn [0, 1]
    let opacity = 0.12 + pulse * 0.38; // [0.12, 0.50]
    
    // Vẽ quầng sáng gradient vàng cam dịu ấm
    let radGrad = ctx.createRadialGradient(
        canvasWidth / 2, canvasHeight / 2, 10,
        canvasWidth / 2, canvasHeight / 2, Math.min(canvasWidth, canvasHeight) * 0.42
    );
    radGrad.addColorStop(0, `rgba(251, 191, 36, ${opacity})`);
    radGrad.addColorStop(0.4, `rgba(249, 115, 22, ${opacity * 0.4})`);
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.save();
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Vẽ các vết nứt mạng nhện rực rỡ khi nhịp đập lên đỉnh (pulse > 0.68)
    if (pulse > 0.68 && eggCracks.length > 0) {
        let crackAlpha = (pulse - 0.68) / 0.32;
        ctx.strokeStyle = `rgba(254, 240, 138, ${crackAlpha * 0.85})`;
        ctx.lineWidth = 1.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#facc15';
        
        ctx.beginPath();
        eggCracks.forEach(c => {
            ctx.moveTo(c.startX, c.startY);
            ctx.lineTo(c.endX, c.endY);
        });
        ctx.stroke();
    }
    ctx.restore();
}

function drawSanctifyingScan() {
    if (!sanctifyingScanActive) return;
    
    // Quét đứng chạy từ trái sang phải màn hình
    sanctifyingScanX += 13;
    
    // Vẽ dải sáng Linear Gradient trắng bạc cực lớn
    let grad = ctx.createLinearGradient(sanctifyingScanX - 120, 0, sanctifyingScanX + 120, 0);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(sanctifyingScanX - 120, 0, 240, canvasHeight);
    
    // Vẽ tia sét trung tâm phát sáng oai vệ thanh tẩy tà vật
    ctx.beginPath();
    ctx.moveTo(sanctifyingScanX, 0);
    ctx.lineTo(sanctifyingScanX, canvasHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.shadowBlur = 35;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.95)';
    ctx.stroke();
    ctx.restore();
    
    // Tự động lặp lại chu kỳ quét thần quang sau mỗi 8 giây
    if (sanctifyingScanX > canvasWidth + 200) {
        sanctifyingScanActive = false;
        setTimeout(() => {
            if (currentChapterId === 19) {
                sanctifyingScanX = -200;
                sanctifyingScanActive = true;
                // Khôi phục các hạt tà khí đen để càn quét lượt tiếp theo
                particles.forEach(p => {
                    if (p.type === 'black_dust') p.reset();
                });
            }
        }, 8000);
    }
}

// ==========================================================================
// HIGH-END ZOOM & PAN DETAILED MAP MODAL ENGINE
// ==========================================================================

let mapScale = 1.0;
let mapPanX = 0;
let mapPanY = 0;
let mapIsDragging = false;
let mapStartX, mapStartY;

// Drag indicators
let mapClickStartX, mapClickStartY;
let mapWasDrag = false;

// Pinch to Zoom multi-touch parameters
let mapTouchStartDist = 0;
let mapTouchStartScale = 1.0;
let mapTouchStartCenter = { x: 0, y: 0 };

function openMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.add('open');
    resetMapModalTransform();
}

function closeMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('open');
}

function handleMapModalBackgroundClick(e) {
    if (e.target.id === 'map-modal-viewport' || e.target.id === 'map-modal') {
        closeMapModal();
    }
}

function openGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (modal) {
        modal.classList.add('open');
    }
}

function closeGuideModal() {
    const modal = document.getElementById('guide-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

function handleGuideModalBackgroundClick(e) {
    const modal = document.getElementById('guide-modal');
    if (e.target === modal) {
        closeGuideModal();
    }
}

function updateMapTransform() {
    const mapImg = document.getElementById('map-modal-img');
    if (mapImg) {
        mapImg.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapScale})`;
    }
}

function resetMapModalTransform() {
    mapScale = 1.0;
    mapPanX = 0;
    mapPanY = 0;
    updateMapTransform();
}

// DESKTOP PAN DRAG LISTENERS
function startMapPan(e) {
    if (e.button !== 0) return; // Allow left click only
    e.preventDefault();
    mapIsDragging = true;
    mapStartX = e.clientX - mapPanX;
    mapStartY = e.clientY - mapPanY;
    
    mapClickStartX = e.clientX;
    mapClickStartY = e.clientY;
    mapWasDrag = false;
    
    const viewport = document.getElementById('map-modal-viewport');
    if (viewport) viewport.style.cursor = 'grabbing';
}

function doMapPan(e) {
    if (!mapIsDragging) return;
    mapPanX = e.clientX - mapStartX;
    mapPanY = e.clientY - mapStartY;
    updateMapTransform();
    
    if (Math.hypot(e.clientX - mapClickStartX, e.clientY - mapClickStartY) > 5) {
        mapWasDrag = true;
    }
}

function endMapPan() {
    mapIsDragging = false;
    const viewport = document.getElementById('map-modal-viewport');
    if (viewport) viewport.style.cursor = 'grab';
}

// DESKTOP WHEEL ZOOM (CENTERED ON CURSOR COORDINATES)
function handleMapWheel(e) {
    e.preventDefault();
    const zoomFactor = 1.18;
    let newScale;
    
    if (e.deltaY < 0) {
        newScale = mapScale * zoomFactor;
    } else {
        newScale = mapScale / zoomFactor;
    }
    
    // Zoom boundary conditions
    newScale = Math.max(0.5, Math.min(8.0, newScale));
    
    const viewport = document.getElementById('map-modal-viewport');
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    
    // Pointer coordinate relative to viewport
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Translate translation matrix offsets centered on cursor zoom
    const ix = (mx - mapPanX) / mapScale;
    const iy = (my - mapPanY) / mapScale;
    
    mapScale = newScale;
    mapPanX = mx - ix * mapScale;
    mapPanY = my - iy * mapScale;
    
    updateMapTransform();
}

// IPHONE / MOBILE MULTI-TOUCH INTERACT GESTURES (PINCH TO ZOOM & SINGLE PAN)
function startMapTouch(e) {
    e.preventDefault();
    
    if (e.touches.length === 1) {
        // Single finger touch drag pan start
        mapIsDragging = true;
        mapStartX = e.touches[0].clientX - mapPanX;
        mapStartY = e.touches[0].clientY - mapPanY;
    } else if (e.touches.length === 2) {
        // Two fingers touch pinch zoom start
        mapIsDragging = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        
        mapTouchStartDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        mapTouchStartScale = mapScale;
        
        const viewport = document.getElementById('map-modal-viewport');
        if (viewport) {
            const rect = viewport.getBoundingClientRect();
            mapTouchStartCenter = {
                x: ((t1.clientX + t2.clientX) / 2) - rect.left,
                y: ((t1.clientY + t2.clientY) / 2) - rect.top
            };
        }
    }
}

function doMapTouch(e) {
    e.preventDefault();
    
    if (e.touches.length === 1 && mapIsDragging) {
        // Single finger panning swipe drag update
        mapPanX = e.touches[0].clientX - mapStartX;
        mapPanY = e.touches[0].clientY - mapStartY;
        updateMapTransform();
    } else if (e.touches.length === 2) {
        // Two fingers pinching scale calculation update
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (mapTouchStartDist > 0) {
            let newScale = mapTouchStartScale * (dist / mapTouchStartDist);
            newScale = Math.max(0.5, Math.min(8.0, newScale));
            
            const mx = mapTouchStartCenter.x;
            const my = mapTouchStartCenter.y;
            
            const ix = (mx - mapPanX) / mapScale;
            const iy = (my - mapPanY) / mapScale;
            
            mapScale = newScale;
            mapPanX = mx - ix * mapScale;
            mapPanY = my - iy * mapScale;
            
            updateMapTransform();
        }
    }
}

function endMapTouch(e) {
    mapIsDragging = false;
    mapTouchStartDist = 0;
    if (e.touches.length === 1) {
        // Resume dragging smoothly with remaining single finger
        mapIsDragging = true;
        mapStartX = e.touches[0].clientX - mapPanX;
        mapStartY = e.touches[0].clientY - mapPanY;
    }
}

// ==========================================================================
// NEMARIAN MYSTERIES & FACTS ROTATOR ENGINE
// ==========================================================================

let currentFactIndex = 0;
let factTimer = null;

function initFactsWidget() {
    // Select a random starting fact
    currentFactIndex = Math.floor(Math.random() * NEMARIAN_FACTS.length);
    displayFact(currentFactIndex);
    resetFactTimer();
}

function displayFact(index) {
    if (index < 0 || index >= NEMARIAN_FACTS.length) return;
    currentFactIndex = index;
    
    const container = document.querySelector('.lore-scroll-container');
    const titleEl = document.getElementById('fact-title-text');
    const contentEl = document.getElementById('lore-text-content');
    const regionEl = document.getElementById('lore-region');
    const widgetHeaderTitle = document.getElementById('crystal-title');
    
    if (!container || !contentEl || !regionEl) return;
    
    // Add fade-out class for transition
    container.classList.add('fade-out');
    
    setTimeout(() => {
        // Update content
        const fact = NEMARIAN_FACTS[index];
        if (widgetHeaderTitle) widgetHeaderTitle.textContent = "📜 Bí Thư Nemarian";
        if (regionEl) regionEl.textContent = `Bí thư ${index + 1} / ${NEMARIAN_FACTS.length}`;
        if (titleEl) titleEl.textContent = fact.title;
        if (contentEl) contentEl.textContent = fact.content;
        
        // Fade back in
        container.classList.remove('fade-out');
    }, 300); // matches 300ms CSS transition duration
}

function nextFact() {
    const nextIdx = (currentFactIndex + 1) % NEMARIAN_FACTS.length;
    displayFact(nextIdx);
    resetFactTimer();
}

function resetFactTimer() {
    if (factTimer) {
        clearInterval(factTimer);
    }
    factTimer = setInterval(() => {
        nextFact();
    }, 25000); // Rotate every 25 seconds
}

function setupMapModalListeners() {
    const viewport = document.getElementById('map-modal-viewport');
    if (viewport) {
        viewport.addEventListener('wheel', handleMapWheel, { passive: false });
    }
}

// Window sizing bounds hooks
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ==========================================================================
// DOM LOADING INITIALIZATION
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
    // Canvas sizing setup
    resizeCanvas();
    
    // Main UI injection
    renderChapters();
    setActiveChapter(1, false);
    
    // Initialize Nemarian facts rotator widget
    initFactsWidget();
    
    // Map zooming activation
    setupMapModalListeners();
    
    // Core animation ticker
    requestAnimationFrame(animateParticles);

    // Active paragraph scrolling tracking listener
    const readerCol = document.getElementById('reader-column');
    if (readerCol) {
        readerCol.addEventListener('scroll', trackActiveParagraph);
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('[PWA] Service Worker registered successfully with scope:', reg.scope))
                .catch(err => console.error('[PWA] Service Worker registration failed:', err));
        });
    }
});

function triggerMagicFlash() {
    const flash = document.createElement('div');
    flash.id = 'magic-screen-overlay';
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.backgroundColor = '#ffffff';
    flash.style.zIndex = '9999';
    flash.style.pointerEvents = 'none';
    flash.style.opacity = '1';
    flash.style.transition = 'opacity 1.2s ease-out';
    document.body.appendChild(flash);
    
    // Trigger animation
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 1200);
    }, 50);
}

function triggerLightColumn() {
    const overlay = document.createElement('div');
    overlay.id = 'magic-screen-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '-100vh';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'top 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
    document.body.appendChild(overlay);
    
    // Quét xuống
    setTimeout(() => {
        overlay.style.top = '100vh';
        setTimeout(() => overlay.remove(), 1600);
    }, 50);
}

// ==========================================================================
// FOCUS MODE (ZEN MODE) LOGIC
// ==========================================================================

let isFocusMode = false;
function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const body = document.body;
    const btn = document.getElementById('focus-btn');
    const icon = document.getElementById('focus-icon');
    const txt = document.getElementById('focus-text');
    
    if (isFocusMode) {
        body.classList.add('focus-active');
        if (btn) btn.classList.add('active');
        if (icon) icon.textContent = "🧘";
        if (txt) txt.textContent = "Tập trung";
        showToast("Đã kích hoạt chế độ đọc tập trung ma pháp!", "🧘");
    } else {
        body.classList.remove('focus-active');
        if (btn) btn.classList.remove('active');
        if (icon) icon.textContent = "👁️";
        if (txt) txt.textContent = "Tập trung";
        showToast("Đã tắt chế độ đọc tập trung.", "👁️");
    }
}
