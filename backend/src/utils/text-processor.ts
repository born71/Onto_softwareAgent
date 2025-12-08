export class TextProcessor {
    private static commonAbbreviations: { [key: string]: string } = {
        'dev': 'developer',
        'eng': 'engineer',
        'mgr': 'manager',
        'fullstack': 'full stack',
        'backend': 'back end',
        'frontend': 'front end',
        'qa': 'quality assurance',
        'ui': 'user interface',
        'ux': 'user experience',
        'ml': 'machine learning',
        'ai': 'artificial intelligence',
        'sr': 'senior',
        'jr': 'junior',
        'tech': 'technical',
        'admin': 'administrator',
        'sys': 'system',
        'ops': 'operations'
    };

    /**
     * Normalize a job title string
     * Handles:
     * 1. Lowercasing
     * 2. Splitting concatenated words (basic)
     * 3. Expanding abbreviations
     */
    static normalizeJobTitle(input: string): string {
        if (!input) return '';

        let normalized = input.toLowerCase().trim();

        // 1. Handle concatenated words (e.g., "fullstackdev")
        // This is a basic heuristic approach. For a production system, 
        // we would use a proper tokenizer or dictionary lookup.
        for (const [abbr, full] of Object.entries(this.commonAbbreviations)) {
            // If the input contains the abbreviation as a substring but not as a standalone word
            // and it's not just the abbreviation itself
            if (normalized.includes(abbr) && !normalized.split(/\s+/).includes(abbr)) {
                // Check if it's a suffix (e.g. "stackdev")
                if (normalized.endsWith(abbr)) {
                    normalized = normalized.replace(abbr, ` ${full}`);
                }
                // Check if it's a prefix (e.g. "devops")
                else if (normalized.startsWith(abbr)) {
                    normalized = normalized.replace(abbr, `${full} `);
                }
                // Middle is harder without messing up other words, skipping for now to be safe
            }
        }

        // 2. Split into tokens
        let tokens = normalized.split(/[\s\-_]+/);

        // 3. Expand abbreviations
        tokens = tokens.map(token => {
            // Check exact match in abbreviations
            if (this.commonAbbreviations[token]) {
                return this.commonAbbreviations[token];
            }

            // Check if token contains known terms (e.g. "fullstack")
            for (const [abbr, full] of Object.entries(this.commonAbbreviations)) {
                if (token === abbr) return full;
            }

            return token;
        });

        return tokens.join(' ').trim().replace(/\s+/g, ' ');
    }

    /**
     * Extract keywords from a normalized string
     */
    static extractKeywords(input: string): string[] {
        const normalized = this.normalizeJobTitle(input);
        // Filter out common stop words if needed, for now just return unique tokens
        const stopWords = ['a', 'an', 'the', 'of', 'for', 'in', 'at', 'to'];
        return normalized.split(' ')
            .filter(w => w.length > 1 && !stopWords.includes(w));
    }
}
