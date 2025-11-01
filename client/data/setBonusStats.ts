import type { SetRarity } from "../constants-alt";

// Corresponds to phy_AP, magic_AP, phy_DP, magic_DP, HP, MP, HP_regen, MP_regen, isabet, kacinma, kritik_sans, kritik_defans, kritik_kat, iyilestirme_kat, hareket_hizi
export interface SetBonusStatValues {
  phy_AP?: number;
  magic_AP?: number;
  phy_DP?: number;
  magic_DP?: number;
  HP?: number;
  MP?: number;
  HP_regen?: number;
  MP_regen?: number;
  isabet?: number;
  kacinma?: number;
  kritik_sans?: number;
  kritik_defans?: number;
  kritik_kat?: number;
  iyilestirme_kat?: number;
  hareket_hizi?: number;
}

export const SET_BONUS_STATS: Record<
  SetRarity,
  Record<string, SetBonusStatValues>
> = {
  common: {
    // MAVI (Uncommon rarity maps to common set bonus)
    // "Guardian's Resolve Set": Fiziksel DP, HP
    A: { phy_DP: 1.1, HP: 10 },
    // "Steelbreaker Set": Fiziksel AP, HP
    B: { phy_AP: 1.1, HP: 10 },
    // "Sanctified Bastion Set": HP, İyileştirme Çarpanı
    C: { HP: 10, iyilestirme_kat: 10 },
    // "Sentinel's Guard Set": Fiziksel DP, HP
    D: { phy_DP: 1.1, HP: 10 },
    // "Shadowstrike Set": Fiziksel AP, HP
    E: { phy_AP: 1.1, HP: 10 },
    // "Arcane Wisp Set": Büyü AP, HP
    F: { magic_AP: 1.1, HP: 10 },
    // "Mystic Ember Set": Büyü AP, MP
    G: { magic_AP: 1.1, MP: 10 },
    // "Dawnbringer Set": MP, İyileştirme Çarpanı
    H: { MP: 10, iyilestirme_kat: 10 },
    // "Ironwall Defender Set": MP Yenilenmesi, Kaçınma
    I: { MP_regen: 0.9, kacinma: 0.6 },
    // "Swiftstrike Set": İsabet, Kritik Şansı
    J: { isabet: 0.7, kritik_sans: 5 },
    // "Arcane Focus Set": MP Yenilenmesi, Kritik Şansı
    K: { MP_regen: 0.9, kritik_sans: 5 },
    // "Lifeward Set": HP Yenilenmesi, MP Yenilenmesi
    L: { HP_regen: 0.9, MP_regen: 0.9 },
  },
  epic: {
    // MOR
    // "Warlord's Honor Set": Fiziksel DP, Büyü DP, HP
    A: { phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    // "Ironclad Fury Set": Fiziksel AP, Fiziksel DP, HP
    B: { phy_AP: 1.1, phy_DP: 1.1, HP: 10 },
    // "Guardian of Light Set": Fiziksel DP, HP, İyileştirme Çarpanı
    C: { phy_DP: 1.1, HP: 10, iyilestirme_kat: 10 },
    // "Whispering Gale Set": Fiziksel AP, Fiziksel DP, HP
    D: { phy_AP: 1.1, phy_DP: 1.1, HP: 10 },
    // "Bladewind Set": Fiziksel AP, Fiziksel DP, HP
    E: { phy_AP: 1.1, phy_DP: 1.1, HP: 10 },
    // "Etherstorm Set": Büyü AP, Fiziksel DP, HP
    F: { magic_AP: 1.1, phy_DP: 1.1, HP: 10 },
    // "Celestial Flame Set": Büyü AP, HP, MP
    G: { magic_AP: 1.1, HP: 10, MP: 10 },
    // "Lifebinder Set": HP, MP, İyileştirme Çarpanı
    H: { HP: 10, MP: 10, iyilestirme_kat: 10 },
    // "Stoneguard Set": MP Yenilenmesi, Kaçınma, Hız
    I: { MP_regen: 0.9, kacinma: 0.6, hareket_hizi: 4 },
    // "Savage Strike Set": İsabet, Kritik Şansı, Kritik Çarpanı
    J: { isabet: 0.7, kritik_sans: 5, kritik_kat: 10 },
    // "Mystic Conduit Set": HP Yenilenmesi, MP Yenilenmesi, Kritik Şansı
    K: { HP_regen: 0.9, MP_regen: 0.9, kritik_sans: 5 },
    // "Serene Blessing Set": HP Yenilenmesi, MP Yenilenmesi, İyileştirme Çarpanı
    L: { HP_regen: 0.9, MP_regen: 0.9, iyilestirme_kat: 10 },
  },
  legendary: {
    // TURUNCU
    A: { phy_AP: 1.1, phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    B: { phy_AP: 1.1, phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    C: { phy_DP: 1.1, magic_DP: 1.1, HP: 10, iyilestirme_kat: 10 },
    D: { phy_AP: 1.1, phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    E: { phy_AP: 1.1, phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    F: { magic_AP: 1.1, phy_DP: 1.1, magic_DP: 1.1, HP: 10 },
    G: { magic_AP: 1.1, phy_DP: 1.1, HP: 10, MP: 10 },
    H: { phy_DP: 1.1, HP: 10, MP: 10, iyilestirme_kat: 10 },
    I: { HP_regen: 0.9, MP_regen: 0.9, kacinma: 0.6, hareket_hizi: 4 },
    J: { HP_regen: 0.9, isabet: 0.7, kritik_sans: 5, kritik_kat: 10 },
    K: { HP_regen: 0.9, MP_regen: 0.9, kritik_sans: 5, kritik_kat: 10 },
    L: { HP_regen: 0.9, MP_regen: 0.9, kacinma: 0.6, iyilestirme_kat: 10 },
  },
  default: {},
};
