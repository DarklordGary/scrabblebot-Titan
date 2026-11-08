// Edit this file to implement your bidding and word-forming strategy.

// Standard Scrabble letter values — useful for valuation.
export const LETTER_VALUE: Record<string, number> = {
  A: 4, B: 3, C: 5, D: 3, E: 4, F: 4, G: 3, H: 4, I: 2, J: 5,
  K: 3, L: 3, M: 4, N: 4, O: 3, P: 3, Q: 10, R: 1, S: 4, T: 4,
  U: 3, V: 2, W: 2, X: 0, Y: 1, Z: 2,
};

export interface BidContext {
  letter: string;        // Letter being auctioned, e.g. "Q"
  myBalance: number;     // Current balance
  myRack: Map<string, number>; // Letters you currently own, letter -> count
}

/**
 * Decide how much to bid for `letter`. Return 0 to skip.
 * Default: bid the letter's face value plus a small premium if you don't have one yet.
 */
export function decideBid(ctx: BidContext): number {
  const value = (LETTER_VALUE[ctx.letter] + 2) * 10;
  return Math.min(value, ctx.myBalance);
}

export interface WordContext {
  myRack: Map<string, number>;
  dictionary: string[]; // Sorted uppercase list, shared at startup
}

/**
 * Try to form a word using letters from `myRack`.
 * Return the word (uppercase) to play, or null to skip.
 *
 * Default strategy: greedily find the longest playable word in the dictionary.
 *
 * Keep this fast. The bot runs it on every rack change, and while it runs
 * the bot can't see the match move on: a search that takes longer than an
 * auction means bids on closed auctions and words from spent letters.
 */
export function chooseWord(ctx: WordContext): string | null {
  // The dictionary is longest first, so the first word we can spell is
  // the longest.
  for (const word of ctx.dictionary) {
    if (canSpell(word, ctx.myRack) && (word.length >= 6 || word.length <= 3)) return word;
    	else if (canSpell(word, ctx.myRack)) return word;
  }
  return null;
}

// Whether `rack` has every letter of `word`, counting repeats.
function canSpell(word: string, rack: Map<string, number>): boolean {
  const used: Record<string, number> = {};
  for (const c of word) {
    used[c] = (used[c] ?? 0) + 1;
    if (used[c] > (rack.get(c) ?? 0)) return false;
  }
  return true;
}
