
// FIX: Moved Costume interface to types.ts to centralize types.
import type { Costume } from '../types';

const silahlarData: Costume[] = [
  // Çift El Kılıç (Unnamed)
  ...Array.from({ length: 23 }, (_, i) => ({
    name: `Çift El Kılıç (0KC${(i + 1).toString().padStart(3, '0')})`,
    command: `/item 0KC${(i + 1).toString().padStart(3, '0')}_000_00_000_999`,
    category: 'Silahlar'
  })),
  // Tek El Kılıç
  { name: 'İnanç Kanadı', command: '/item 0KA001_000_00_000_999', category: 'Silahlar' },
  { name: 'Yakut Şimşeği', command: '/item 0KA002_000_00_000_999', category: 'Silahlar' },
  { name: 'Ejder Pençesi', command: '/item 0KA003_000_00_000_999', category: 'Silahlar' },
  { name: 'Anostia Bekçisi', command: '/item 0KA004_000_00_000_999', category: 'Silahlar' },
  { name: 'Şafak', command: '/item 0KA005_000_00_000_999', category: 'Silahlar' },
  { name: 'Antik Miras', command: '/item 0KA006_000_00_000_999', category: 'Silahlar' },
  { name: 'Ruh Toplayıcı', command: '/item 0KA007_000_00_000_999', category: 'Silahlar' },
  { name: 'Altın Halka Kılıcı', command: '/item 0KA008_000_00_000_999', category: 'Silahlar' },
  { name: 'Ruhun Kılıcı', command: '/item 0KA009_000_00_000_999', category: 'Silahlar' },
  { name: 'Dawnpiercer', command: '/item 0KA010_000_00_000_999', category: 'Silahlar' },
  { name: 'Radiant Oathblade', command: '/item 0KA011_000_00_000_999', category: 'Silahlar' },
  { name: 'Bloodfang Spire', command: '/item 0KA012_000_00_000_999', category: 'Silahlar' },
  { name: 'Silverfang Spire', command: '/item 0KA013_000_00_000_999', category: 'Silahlar' },
  { name: 'Sun Vow', command: '/item 0KA014_000_00_000_999', category: 'Silahlar' },
  { name: 'Cold Vow', command: '/item 0KA015_000_00_000_999', category: 'Silahlar' },
  { name: 'Bone Oath: Malice', command: '/item 0KA016_000_00_000_999', category: 'Silahlar' },
  { name: 'Bone Oath: Sancta', command: '/item 0KA017_000_00_000_999', category: 'Silahlar' },
  { name: 'Shadowed Oath: Lun', command: '/item 0KA018_000_00_000_999', category: 'Silahlar' },
  { name: 'Shadowed Oath: Nox', command: '/item 0KA019_000_00_000_999', category: 'Silahlar' },
  { name: 'Nocturnis', command: '/item 0KA020_000_00_000_999', category: 'Silahlar' },
  { name: 'Seraphblade', command: '/item 0KA021_000_00_000_999', category: 'Silahlar' },
  { name: 'Judgment Wing: Reve', command: '/item 0KA022_000_00_000_999', category: 'Silahlar' },
  { name: 'Judgment Wing: Phoe', command: '/item 0KA023_000_00_000_999', category: 'Silahlar' },
  { name: 'Crimson Crescent', command: '/item 0KA024_000_00_000_999', category: 'Silahlar' },
  // Kalkan
  { name: 'Rüzgar Barikatı', command: '/item 0KB001_000_00_000_999', category: 'Silahlar' },
  { name: 'Ay Kalkanı', command: '/item 0KB002_000_00_000_999', category: 'Silahlar' },
  { name: 'Haydutların Koruması', command: '/item 0KB003_000_00_000_999', category: 'Silahlar' },
  { name: 'Hükümdar Koruması', command: '/item 0KB004_000_00_000_999', category: 'Silahlar' },
  { name: 'Gümüş Ayı', command: '/item 0KB005_000_00_000_999', category: 'Silahlar' },
  { name: 'Seraphic Kalkan', command: '/item 0KB006_000_00_000_999', category: 'Silahlar' },
  { name: 'Güneş Aegis', command: '/item 0KB007_000_00_000_999', category: 'Silahlar' },
  { name: 'Güneş Işığı', command: '/item 0KB008_000_00_000_999', category: 'Silahlar' },
  { name: 'Flareguard', command: '/item 0KB009_000_00_000_999', category: 'Silahlar' },
  { name: 'Kara İnanç', command: '/item 0KB010_000_00_000_999', category: 'Silahlar' },
  { name: 'Ejderha\'nın Yolu', command: '/item 0KB011_000_00_000_999', category: 'Silahlar' },
  { name: 'Eski Karanlık Miras', command: '/item 0KB012_000_00_000_999', category: 'Silahlar' },
  { name: 'İmparatorluk Lejyonu', command: '/item 0KB013_000_00_000_999', category: 'Silahlar' },
  { name: 'Süvari Onuru', command: '/item 0KB014_000_00_000_999', category: 'Silahlar' },
  { name: 'Düşmüş Zambak', command: '/item 0KB015_000_00_000_999', category: 'Silahlar' },
  { name: 'Serafın Kalkanı', command: '/item 0KB016_000_00_000_999', category: 'Silahlar' },
  { name: 'Lioncrest', command: '/item 0KB017_000_00_000_999', category: 'Silahlar' },
  { name: 'Thronewall', command: '/item 0KB018_000_00_000_999', category: 'Silahlar' },
  { name: 'Kheperion', command: '/item 0KB019_000_00_000_999', category: 'Silahlar' },
  { name: 'Crest of the Lionflame', command: '/item 0KB020_000_00_000_999', category: 'Silahlar' },
  { name: 'Crest of the Lionflame 2', command: '/item 0KB021_000_00_000_999', category: 'Silahlar' },
  { name: 'Crest of the Lionflan Embergold', command: '/item 0KB022_000_00_000_999', category: 'Silahlar' },
  // Mızrak
  { name: 'Kahramanın Mirası', command: '/item 0KD001_000_00_000_999', category: 'Silahlar' },
  { name: 'Fırtına Rüzgarı', command: '/item 0KD002_000_00_000_999', category: 'Silahlar' },
  { name: 'Ruh Fırtınası', command: '/item 0KD003_000_00_000_999', category: 'Silahlar' },
  { name: 'Ölüm Dansı', command: '/item 0KD004_000_00_000_999', category: 'Silahlar' },
  { name: 'Şimşek Delici', command: '/item 0KD005_000_00_000_999', category: 'Silahlar' },
  { name: 'Güneş Parçası', command: '/item 0KD006_000_00_000_999', category: 'Silahlar' },
  { name: 'Gölgenin Kucaklaşması', command: '/item 0KD007_000_00_000_999', category: 'Silahlar' },
  { name: 'Yıldız Yağmuru', command: '/item 0KD008_000_00_000_999', category: 'Silahlar' },
  { name: 'Başmeleğin Mızrağı', command: '/item 0KD009_000_00_000_999', category: 'Silahlar' },
  { name: 'Solpiercer', command: '/item 0KD010_000_00_000_999', category: 'Silahlar' },
  { name: 'Divine Spear', command: '/item 0KD011_000_00_000_999', category: 'Silahlar' },
  { name: 'Hellchant', command: '/item 0KD012_000_00_000_999', category: 'Silahlar' },
  { name: 'Spear of Vengeance', command: '/item 0KD013_000_00_000_999', category: 'Silahlar' },
  // Çift Balta
  { name: 'Alev ve Kor', command: '/item 0KE001_000_00_000_999', category: 'Silahlar' },
  { name: 'Fırtına Kesici', command: '/item 0KE002_000_00_000_999', category: 'Silahlar' },
  { name: 'Titan\'ın Kavrayışı', command: '/item 0KE003_000_00_000_999', category: 'Silahlar' },
  { name: 'Gölge Darbesi', command: '/item 0KE004_000_00_000_999', category: 'Silahlar' },
  { name: 'Kader Taşıyıcı', command: '/item 0KE005_000_00_000_999', category: 'Silahlar' },
  { name: 'Yemin Bozan', command: '/item 0KE006_000_00_000_999', category: 'Silahlar' },
  { name: 'Gök Gürültülü Bıçak', command: '/item 0KE007_000_00_000_999', category: 'Silahlar' },
  { name: 'Soğuk Kesici', command: '/item 0KE008_000_00_000_999', category: 'Silahlar' },
  { name: 'Runebıçak', command: '/item 0KE009_000_00_000_999', category: 'Silahlar' },
  { name: 'Girdap', command: '/item 0KE010_000_00_000_999', category: 'Silahlar' },
  { name: 'Karanlık Kalp', command: '/item 0KE011_000_00_000_999', category: 'Silahlar' },
  { name: 'Güneş Tutulması', command: '/item 0KE012_000_00_000_999', category: 'Silahlar' },
  { name: 'Ruh Parçalayıcı', command: '/item 0KE013_000_00_000_999', category: 'Silahlar' },
  { name: 'Yarıklar Yaratıcı', command: '/item 0KE014_000_00_000_999', category: 'Silahlar' },
  { name: 'Hayat İçen', command: '/item 0KE015_000_00_000_999', category: 'Silahlar' },
  { name: 'İntikam', command: '/item 0KE016_000_00_000_999', category: 'Silahlar' },
  { name: 'Voidripper', command: '/item 0KE017_000_00_000_999', category: 'Silahlar' },
  { name: 'Alevkesen', command: '/item 0KE018_000_00_000_999', category: 'Silahlar' },
  { name: 'Zırhlanmış', command: '/item 0KE019_000_00_000_999', category: 'Silahlar' },
  { name: 'Phoenix Kanat', command: '/item 0KE020_000_00_000_999', category: 'Silahlar' },
  { name: 'Dul Yapan', command: '/item 0KE021_000_00_000_999', category: 'Silahlar' },
  { name: 'Cennetin Hükmü', command: '/item 0KE022_000_00_000_999', category: 'Silahlar' },
  // Hançer
  { name: 'Suikastçının Pusu', command: '/item 0KF001_000_00_000_999', category: 'Silahlar' },
  { name: 'Gece\'nin Kenarı', command: '/item 0KF002_000_00_000_999', category: 'Silahlar' },
  { name: 'Fısıldayan Bıçaklar', command: '/item 0KF003_000_00_000_999', category: 'Silahlar' },
  { name: 'Çift Bıçak', command: '/item 0KF004_000_00_000_999', category: 'Silahlar' },
  { name: 'Yılanın Öpücüğü', command: '/item 0KF005_000_00_000_999', category: 'Silahlar' },
  { name: 'İmparatorun Hizmeti', command: '/item 0KF006_000_00_000_999', category: 'Silahlar' },
  { name: 'Üzüntü Kılıcı', command: '/item 0KF007_000_00_000_999', category: 'Silahlar' },
  { name: 'Erdem Rün Kılıcı', command: '/item 0KF008_000_00_000_999', category: 'Silahlar' },
  { name: 'Sanguinblade', command: '/item 0KF009_000_00_000_999', category: 'Silahlar' },
  { name: 'Whisperthorn', command: '/item 0KF010_000_00_000_999', category: 'Silahlar' },
  { name: 'Noctblade', command: '/item 0KF011_000_00_000_999', category: 'Silahlar' },
  // Yay
  { name: 'Artemis\'in Fısıltısı', command: '/item 0KG001_000_00_000_999', category: 'Silahlar' },
  { name: 'Yıldız Avcısı', command: '/item 0KG002_000_00_000_999', category: 'Silahlar' },
  { name: 'Alev Teli', command: '/item 0KG003_000_00_000_999', category: 'Silahlar' },
  { name: 'Gök Yarığı', command: '/item 0KG004_000_00_000_999', category: 'Silahlar' },
  { name: 'Öte Oku', command: '/item 0KG005_000_00_000_999', category: 'Silahlar' },
  { name: 'Ruh Arayan', command: '/item 0KG006_000_00_000_999', category: 'Silahlar' },
  { name: 'Gök Cüsü', command: '/item 0KG007_000_00_000_999', category: 'Silahlar' },
  { name: 'Hayalet Teli', command: '/item 0KG008_000_00_000_999', category: 'Silahlar' },
  { name: 'Fırtına Kese', command: '/item 0KG009_000_00_000_999', category: 'Silahlar' },
  { name: 'Gölge Avcısı', command: '/item 0KG010_000_00_000_999', category: 'Silahlar' },
  { name: 'Talonstride', command: '/item 0KG011_000_00_000_999', category: 'Silahlar' },
  { name: 'Varnclaw', command: '/item 0KG012_000_00_000_999', category: 'Silahlar' },
  { name: 'Gildmourne', command: '/item 0KG013_000_00_000_999', category: 'Silahlar' },
  // Arbalet
  { name: 'Buzlu Çelik', command: '/item 0KH001_000_00_000_999', category: 'Silahlar' },
  { name: 'Ejderha\'nın Gazabı', command: '/item 0KH002_000_00_000_999', category: 'Silahlar' },
  { name: 'Ölümcül Zehir', command: '/item 0KH003_000_00_000_999', category: 'Silahlar' },
  { name: 'Arkanay Boltatıcı', command: '/item 0KH004_000_00_000_999', category: 'Silahlar' },
  { name: 'Donmuş Fırtına', command: '/item 0KH005_000_00_000_999', category: 'Silahlar' },
  { name: 'Astral Av', command: '/item 0KH006_000_00_000_999', category: 'Silahlar' },
  { name: 'İmparator Nişancısı', command: '/item 0KH007_000_00_000_999', category: 'Silahlar' },
  { name: 'Okçunun Gazabı', command: '/item 0KH008_000_00_000_999', category: 'Silahlar' },
  { name: 'Ölüm Avcısı', command: '/item 0KH009_000_00_000_999', category: 'Silahlar' },
  // Balyoz
  { name: 'Mjolnir\'in Yankısı', command: '/item 0KL001_000_00_000_999', category: 'Silahlar' },
  { name: 'Savaş Şefi\'nin Tokmağı', command: '/item 0KL002_000_00_000_999', category: 'Silahlar' },
  { name: 'Cehennem Ocağı', command: '/item 0KL003_000_00_000_999', category: 'Silahlar' },
  { name: 'Çığlık', command: '/item 0KL004_000_00_000_999', category: 'Silahlar' },
  { name: 'Ragnarok\'un Habercisi', command: '/item 0KL005_000_00_000_999', category: 'Silahlar' },
  { name: 'Fırtına\'nın Rüğanı', command: '/item 0KL006_000_00_000_999', category: 'Silahlar' },
  { name: 'Gökten Gelen Yıkıcı', command: '/item 0KL007_000_00_000_999', category: 'Silahlar' },
  { name: 'Korkubakar', command: '/item 0KL008_000_00_000_999', category: 'Silahlar' },
  { name: 'Titan\'ın Yumruğu', command: '/item 0KL009_000_00_000_999', category: 'Silahlar' },
  { name: 'Valkyrie\'nin Yargısı', command: '/item 0KL010_000_00_000_999', category: 'Silahlar' },
  { name: 'Gökten Gelen Çekiç', command: '/item 0KL011_000_00_000_999', category: 'Silahlar' },
  { name: 'Kara Güneş', command: '/item 0KL012_000_00_000_999', category: 'Silahlar' },
  { name: 'Ejderha\'nın Ağzı', command: '/item 0KL013_000_00_000_999', category: 'Silahlar' },
  { name: 'İmparatorun Gazabı', command: '/item 0KL014_000_00_000_999', category: 'Silahlar' },
  { name: 'Recton Maul', command: '/item 0KL015_000_00_000_999', category: 'Silahlar' },
  { name: 'Ultherak', command: '/item 0KL016_000_00_000_999', category: 'Silahlar' },
  { name: 'Gor Thalmar', command: '/item 0KL017_000_00_000_999', category: 'Silahlar' },
  { name: 'Myrrak-Zûn', command: '/item 0KL018_000_00_000_999', category: 'Silahlar' },
  { name: 'Malgroth', command: '/item 0KL019_000_00_000_999', category: 'Silahlar' },
  { name: 'Kyrravos', command: '/item 0KL020_000_00_000_999', category: 'Silahlar' },
  { name: 'Varnomir', command: '/item 0KL021_000_00_000_999', category: 'Silahlar' },
  { name: 'Solanar', command: '/item 0KL022_000_00_000_999', category: 'Silahlar' },
  // Asa
  ...[...Array.from({ length: 72 }, (_, i) => {
    const num = i + 1;
    let name = `Asa (0KJ${num.toString().padStart(3, '0')})`;
    if (num === 1) name = 'Arcane Enigma [Kırmızı]';
    if (num === 2) name = 'Arcane Enigma [Yeşil]';
    if (num === 3) name = 'Arcane Enigma [Mavi]';
    if (num === 4) name = 'Arcane Enigma [Mor]';
    if (num === 5) name = 'Mistik Ayas [Kırmızı]';
    if (num === 6) name = 'Mistik Ayas [Yeşil]';
    if (num === 7) name = 'Mistik Ayas [Mavi]';
    if (num === 8) name = 'Mistik Ayas [Mor]';
    if (num === 9) name = 'Elemental İnanç [Kırmızı]';
    if (num === 10) name = 'Elemental İnanç [Yeşil]';
    if (num === 11) name = 'Elemental İnanç [Mavi]';
    if (num === 12) name = 'Elemental İnanç [Mor]';
    if (num === 13) name = 'Sadık Kristal [Kırmızı]';
    if (num === 14) name = 'Sadık Kristal [Yeşil]';
    if (num === 15) name = 'Sadık Kristal [Mavi]';
    if (num === 16) name = 'Sadık Kristal [Mor]';
    if (num === 17) name = 'Elemental Öfke [Kırmızı]';
    if (num === 18) name = 'Elemental Öfke [Yeşil]';
    if (num === 19) name = 'Elemental Öfke [Mavi]';
    if (num === 20) name = 'Elemental Öfke [Mor]';
    if (num === 21) name = 'Donmuş Yıldızışığı [Kırmızı]';
    if (num === 22) name = 'Donmuş Yıldızışığı [Yeşil]';
    if (num === 23) name = 'Donmuş Yıldızışığı [Mavi]';
    if (num === 24) name = 'Donmuş Yıldızışığı [Mor]';
    if (num === 25) name = 'Abysal Sihir [Kırmızı]';
    if (num === 26) name = 'Abysal Sihir [Yeşil]';
    if (num === 27) name = 'Abysal Sihir [Mavi]';
    if (num === 28) name = 'Abysal Sihir [Mor]';
    if (num === 29) name = 'Gök Gürültülü [Kırmızı]';
    if (num === 30) name = 'Gök Gürültülü [Yeşil]';
    if (num === 31) name = 'Gök Gürültülü [Mavi]';
    if (num === 32) name = 'Gök Gürültülü [Mor]';
    if (num === 33) name = 'Eterik Perde [Kırmızı]';
    if (num === 34) name = 'Eterik Perde [Yeşil]';
    if (num === 35) name = 'Eterik Perde [Mavi]';
    if (num === 36) name = 'Eterik Perde [Mor]';
    if (num === 37) name = 'Void Gözetleyici [Kırmızı]';
    if (num === 38) name = 'Void Gözetleyici [Yeşil]';
    if (num === 39) name = 'Void Gözetleyici [Mavi]';
    if (num === 40) name = 'Void Gözetleyici [Mor]';
    if (num === 41) name = 'Astral Yanılsama [Kırmızı]';
    if (num === 42) name = 'Astral Yanılsama [Yeşil]';
    if (num === 43) name = 'Astral Yanılsama [Mavi]';
    if (num === 44) name = 'Astral Yanılsama [Mor]';
    if (num === 45) name = 'Hava Ustası [Kırmızı]';
    if (num === 46) name = 'Hava Ustası [Yeşil]';
    if (num === 47) name = 'Hava Ustası [Mavi]';
    if (num === 48) name = 'Hava Ustası [Mor]';
    if (num === 49) name = 'Seraphic Yıldız Yağmuru [Kırmızı]';
    if (num === 50) name = 'Seraphic Yıldız Yağmuru [Yeşil]';
    if (num === 51) name = 'Seraphic Yıldız Yağmuru [Mavi]';
    if (num === 52) name = 'Seraphic Yıldız Yağmuru [Mor]';
    if (num === 53) name = 'Büyücünün Bilgeliği [Kırmızı]';
    if (num === 54) name = 'Büyücünün Bilgeliği [Yeşil]';
    if (num === 55) name = 'Büyücünün Bilgeliği [Mavi]';
    if (num === 56) name = 'Büyücünün Bilgeliği [Mor]';
    if (num === 57) name = 'Güneşparlak [Kırmızı]';
    if (num === 58) name = 'Güneşparlak [Yeşil]';
    if (num === 59) name = 'Güneşparlak [Mavi]';
    if (num === 60) name = 'Güneşparlak [Mor]';
    if (num === 61) name = 'Ay Taşı';
    if (num === 62) name = 'Karanlık Kralın Asası';
    if (num === 63) name = 'Ashpiercer';
    if (num === 64) name = 'Scaelrend';
    if (num === 65) name = 'Solvaen\'s Spine';
    if (num === 66) name = 'Nalthraxxis';
    if (num === 67) name = 'Khepraxus';
    if (num === 68) name = 'Aethryx';
    if (num === 69) name = 'Vyrmaghul';
    if (num === 70) name = 'Drelghast';
    if (num === 71) name = 'Virathai';
    if (num === 72) name = 'Solthariel';
    
    return { name, command: `/item 0KJ${num.toString().padStart(3, '0')}_000_00_000_999`, category: 'Silahlar' };
  })],
];

const kasklarData: Costume[] = [
  { name: 'Göksel Kask', command: '/item 0K4001_000_00_000_999', category: 'Kasklar' },
  { name: 'Gorgon Sureti', command: '/item 0K4002_000_00_000_999', category: 'Kasklar' },
  { name: 'Ölüm Kafatası Kalkanı', command: '/item 0K4003_000_00_000_999', category: 'Kasklar' },
  { name: 'Karanlık Koruyucu Kaskı', command: '/item 0K4004_000_00_000_999', category: 'Kasklar' },
  { name: 'Titan Başlık', command: '/item 0K4005_000_00_000_999', category: 'Kasklar' },
  { name: 'İnfernal Kask', command: '/item 0K4006_000_00_000_999', category: 'Kasklar' },
  { name: 'Saraycık Kaskı', command: '/item 0K4007_000_00_000_999', category: 'Kasklar' },
  { name: 'Alevkalkan Başlığı', command: '/item 0K4008_000_00_000_999', category: 'Kasklar' },
  { name: 'Runebağlı Kask', command: '/item 0K4009_000_00_000_999', category: 'Kasklar' },
  { name: 'Gölge Suikastçısı', command: '/item 0K4010_000_00_000_999', category: 'Kasklar' },
  { name: 'Fırtınalordu', command: '/item 0K4011_000_00_000_999', category: 'Kasklar' },
  { name: 'Engerekvuruşu Sureti', command: '/item 0K4012_000_00_000_999', category: 'Kasklar' },
  { name: 'Melek Tacı', command: '/item 0K4013_000_00_000_999', category: 'Kasklar' },
  { name: 'Ay Muhafızı', command: '/item 0K4014_000_00_000_999', category: 'Kasklar' },
  { name: 'Boşluk Yürüyücü Başlığı', command: '/item 0K4015_000_00_000_999', category: 'Kasklar' },
  { name: 'Savaşlordu Kaskı', command: '/item 0K4016_000_00_000_999', category: 'Kasklar' },
  { name: 'Cehennem Alevi', command: '/item 0K4017_000_00_000_999', category: 'Kasklar' },
  { name: 'Gölgeşeytan', command: '/item 0K4018_000_00_000_999', category: 'Kasklar' },
  { name: 'Perdelemiş Hayalet', command: '/item 0K4019_000_00_000_999', category: 'Kasklar' },
  { name: 'Yıldızkaynak', command: '/item 0K4020_000_00_000_999', category: 'Kasklar' },
  { name: 'İnfernal Gözetleyici', command: '/item 0K4021_000_00_000_999', category: 'Kasklar' },
  { name: 'Ruhbağlı', command: '/item 0K4022_000_00_000_999', category: 'Kasklar' },
  { name: 'Ölüme Gölgeli', command: '/item 0K4023_000_00_000_999', category: 'Kasklar' },
  { name: 'Gürültülü', command: '/item 0K4024_000_00_000_999', category: 'Kasklar' },
  { name: 'Devasal', command: '/item 0K4025_000_00_000_999', category: 'Kasklar' },
  { name: 'Ejderhaderi', command: '/item 0K4026_000_00_000_999', category: 'Kasklar' },
  { name: 'Fırtınakovan', command: '/item 0K4027_000_00_000_999', category: 'Kasklar' },
  { name: 'Buzbağlı Muhafız', command: '/item 0K4028_000_00_000_999', category: 'Kasklar' },
];

const erkekKostumleriData: Costume[] = Array.from({ length: 57 }, (_, i) => ({
    name: `Erkek Zırh (1K${(i + 1001).toString()})`,
    command: `/item 1K${(i + 1001).toString()}_000_00_000_999`,
    category: 'Erkek Kostümleri'
}));

const kadinKostumleriData: Costume[] = [
  { name: 'Beyaz Kraliçe Zarafeti', command: '/item 2K1001_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Karanlığın Sesi', command: '/item 2K1002_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Naresia\'nın Göksel Zırhı', command: '/item 2K1003_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Vahşi Doğa\'nın Ruhu', command: '/item 2K1004_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sürekli Yetki', command: '/item 2K1005_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Okyanus Meleği', command: '/item 2K1006_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Kanunsuz Yalnızlık', command: '/item 2K1007_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Kraliçenin Koruyucusu', command: '/item 2K1008_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Kraliçenin Muhafızı', command: '/item 2K1009_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Kraliçenin Celladı', command: '/item 2K1010_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ruh Töreni', command: '/item 2K1011_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Kış Örtüsü', command: '/item 2K1012_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Muazzam Güç', command: '/item 2K1013_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Gravemark Hellsteel', command: '/item 2K1014_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Eidolon of Frostveil', command: '/item 2K1015_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Secret Hero Armor', command: '/item 2K1016_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Voidthorn Vexatrix', command: '/item 2K1017_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Voidthorn Vexatrix 2', command: '/item 2K1018_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Voidthorn Vexatrix 3', command: '/item 2K1019_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Voldthorn Vexatrix', command: '/item 2K1020_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Scarlet Bloom', command: '/item 2K1021_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Azure Crest', command: '/item 2K1022_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Dune Whisper', command: '/item 2K1023_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Coral Mist', command: '/item 2K1024_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Coral Drift', command: '/item 2K1025_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Melon Bloom', command: '/item 2K1026_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Blossom Vein', command: '/item 2K1027_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Wild Mirage', command: '/item 2K1028_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sunset Crest', command: '/item 2K1029_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Coral Mist 2', command: '/item 2K1030_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Prism Bloom', command: '/item 2K1031_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ivory Halo', command: '/item 2K1032_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ocean Whisper', command: '/item 2K1033_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sunveil Breeze', command: '/item 2K1034_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Citrus Flame', command: '/item 2K1035_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Nightfang Silk', command: '/item 2K1036_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Tide Lines', command: '/item 2K1037_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Blossom Ink', command: '/item 2K1038_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Lilac Whisper', command: '/item 2K1039_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Summer Slice', command: '/item 2K1040_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sundara Bloom', command: '/item 2K1041_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sundara Blush', command: '/item 2K1042_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sundara Mirage', command: '/item 2K1043_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sundara Coast', command: '/item 2K1044_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Duskwrought Gold', command: '/item 2K1045_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ember Pact', command: '/item 2K1046_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Voidpetal Bloom', command: '/item 2K1047_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Thorns of Viridia', command: '/item 2K1048_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Pale Dignity', command: '/item 2K1049_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Azure Mirage', command: '/item 2K1050_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Dune Whisper 2', command: '/item 2K1051_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Blood Oath', command: '/item 2K1052_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Moon Ash', command: '/item 2K1053_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Obsidian Crest', command: '/item 2K1054_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Azure Oath', command: '/item 2K1055_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Verdant Vigil', command: '/item 2K1056_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Crimson Vow', command: '/item 2K1057_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ivory Sentinel', command: '/item 2K1058_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Noctera Bloom', command: '/item 2K1059_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Noctera Bloom 2', command: '/item 2K1060_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Noctera Bloom 3', command: '/item 2K1061_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Noctera Bloom 4', command: '/item 2K1062_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Noctera Bloom 5', command: '/item 2K1063_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Wyrdwood Wanderer', command: '/item 2K1064_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Wyrdwood Wanderer 2', command: '/item 2K1065_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Wyrdwood Wanderer 3', command: '/item 2K1066_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Crimson', command: '/item 2K1067_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Abyss Vein', command: '/item 2K1068_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Venom Crest', command: '/item 2K1069_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ash Warden', command: '/item 2K1070_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Ossarion Oracle', command: '/item 2K1071_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Sagepath Pilgrim', command: '/item 2K1072_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Scarlet Oath', command: '/item 2K1073_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Nocturne', command: '/item 2K1074_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Verdant Coil', command: '/item 2K1075_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Blood Ember', command: '/item 2K1076_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Tenebria', command: '/item 2K1077_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Yurel', command: '/item 2K1078_000_00_000_999', category: 'Kadın Kostümleri' },
  { name: 'Yurel 2', command: '/item 2K1079_000_00_000_999', category: 'Kadın Kostümleri' },
];

const petKostumleriData: Costume[] = [
  { name: 'Efsunlu Anka', command: '/item 0501_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Zeka Küpü', command: '/item 0502_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Bilgelik Mimarisi', command: '/item 0503_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Akıl Lordu', command: '/item 0504_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Ateşin Efendisi', command: '/item 0505_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Abyssal Dehşet', command: '/item 0506_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kristal Tavşan', command: '/item 0507_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Altın Tavşan', command: '/item 0508_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Karanlık Hoplayan', command: '/item 0509_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Işığın Koşucusu', command: '/item 0510_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Karanlık Gezgin', command: '/item 0511_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gökyüzü Yeleli', command: '/item 0512_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Lav Pençesi', command: '/item 0513_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kışın Ayak İzleri', command: '/item 0514_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Göz Kamaştıran Kurt', command: '/item 0515_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Işık Sıçanı', command: '/item 0516_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gölge Kemirgen', command: '/item 0517_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Altın Kemirgen', command: '/item 0518_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Geceyarısı Kahini', command: '/item 0519_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Zehir Sıçrayanı', command: '/item 0520_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Işıltı Yılanı', command: '/item 0521_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kül Yaratığı', command: '/item 0522_00_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Zırhlı Savaşçı', command: '/item K001_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kanlı Şövalye', command: '/item K002_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Altın Muhafız', command: '/item K003_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gölgelerin Gezgini', command: '/item K004_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kara Komutan', command: '/item K005_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Demir Muhafız', command: '/item K006_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Asil Şövalye', command: '/item K007_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Fırtına Binicisi', command: '/item K008_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gölge Seyyahı', command: '/item K009_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gece Gezgini', command: '/item K010_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Sislerin Bekçisi', command: '/item K011_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Çöl Yolcusu', command: '/item K012_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Altın Tacir', command: '/item K013_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kanlı Efsane', command: '/item K014_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Asil Şövalye 2', command: '/item K015_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Zümrüt Muhafız', command: '/item K016_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Alev Muhafızı', command: '/item K017_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Karanlık Avcı', command: '/item K018_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Mavi Şövalye', command: '/item K019_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Gümüş Savaşçı', command: '/item K020_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Altın Kalkan', command: '/item K021_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Kanlı Fısıltı', command: '/item K022_0000000000_0_0_000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Mermaid Ship', command: '/item 5001_0000000000000000000000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Charon\'s Ferry Ship', command: '/item 5002_0000000000000000000000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Medusa Ship', command: '/item 5003_0000000000000000000000_00_0000', category: 'Pet Kostümleri' },
  { name: 'Trident Ship', command: '/item 5004_0000000000000000000000_00_0000', category: 'Pet Kostümleri' },
];

export const costumeData: Costume[] = [
    ...silahlarData,
    ...kasklarData,
    ...erkekKostumleriData,
    ...kadinKostumleriData,
    ...petKostumleriData,
];