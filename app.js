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
    3: { name: "Núi Ignir (Định Thiêng)", x: 62, y: 25 },
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
    18: { name: "Ký ức Hồ Đen (Ngôi Nhà Đá)", x: 89, y: 30 },
    19: { name: "Gò Đất Cao Ven Hồ Đen", x: 41, y: 40 },
    20: { name: "Vách Núi Nam Hồ Đen (Cốt Long)", x: 85, y: 47 }
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
    
    document.body.className = `theme-${themeName}`;
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
                pTag.textContent = p;
                pTag.style.cursor = 'pointer';
                pTag.title = "Bấm đúp chuột để phát âm thanh từ đoạn này";
                pTag.addEventListener('dblclick', () => {
                    if (currentChapterId === ch.id) {
                        startTTSFromParagraph(idx);
                    }
                });
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
    document.body.className = `theme-${meta.theme}`;
    selectedTheme = meta.theme;

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
    // 1. Preprocess text to replace mid-sentence dashes with a period for a full narrative breathing pause (equivalent to a period pause)
    const processedText = text.trim()
        .replace(/(?<!^)(?:\s+[-—–]\s*|\s*[-—–]\s+)/g, '. ');
    
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
        // Preprocess text to replace mid-sentence dashes with a period for a full narrative breathing pause (equivalent to a period pause)
        const preprocessedText = pText.trim()
            .replace(/(?<!^)(?:\s+[-—–]\s*|\s*[-—–]\s+)/g, '. ');
            
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
    constructor(colors, baseSpeed, direction = 1) {
        this.reset(colors, baseSpeed, direction);
        // Scatter particles initially with random states to avoid synchronized fade-ins
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.alpha = Math.random() * this.maxAlpha;
        this.fadeState = Math.random() > 0.5 ? 'in' : 'out';
    }

    reset(colors, baseSpeed, direction = 1) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2.5 + 0.8;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0;
        this.maxAlpha = (Math.random() * 0.55 + 0.15) * 1.2;
        this.fadeState = 'in';
        // slow organic fade speed: takes ~200-500 frames to fade in/out
        this.fadeSpeed = Math.random() * 0.0025 + 0.001;
        
        // Wandering / aimless drift parameters (trôi lững lờ không quỹ đạo)
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = Math.random() * 0.016 - 0.008; // slow turn rate
        this.speed = Math.random() * baseSpeed * 0.8 + 0.05; // slow drift speed magnitude
    }

    update(colors, baseSpeed, direction = 1) {
        // Slow lazy wander
        this.angle += this.angleSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Fading in and out logic (nổi lên rồi tắt)
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
                this.reset(colors, baseSpeed, direction);
            }
        }

        // Boundary checks - reset particle if it drifts off screen bounds
        if (this.x < -20 || this.x > canvasWidth + 20 || this.y < -20 || this.y > canvasHeight + 20) {
            this.reset(colors, baseSpeed, direction);
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        // Neon ambient outer glow filter
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = this.color;
        
        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    if (!particlesEnabled) return;
    
    const config = THEME_PARTICLES[selectedTheme] || THEME_PARTICLES.forest;
    const direction = config.direction || 1;
    
    for (let i = 0; i < config.count; i++) {
        particles.push(new Particle(config.color, config.speed, direction));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (particlesEnabled) {
        const config = THEME_PARTICLES[selectedTheme] || THEME_PARTICLES.forest;
        const direction = config.direction || 1;
        
        particles.forEach(p => {
            p.update(config.color, config.speed, direction);
            p.draw();
        });
    }
    
    requestAnimationFrame(animateParticles);
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
