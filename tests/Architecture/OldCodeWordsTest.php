<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\TestCase;

/**
 * Version 6 is the new version, so nothing in it is old: no name holds Legacy, Old or Deprecated, and no comment says a
 * thing is the old one, legacy, deprecated or kept until a cutover. Only another program's own words for its older
 * protocol stay, in the files listed with their reason.
 */
final class OldCodeWordsTest extends TestCase
{
    private const string OLD_NAME = '/^(?:Legacy|Old|Deprecated)[A-Z_]|[a-z](?:Legacy|Deprecated)(?:[A-Z_]|$)'
        .'|^(?:legacy|deprecated)[A-Z_]/';

    private const string OLD_COMMENT = '/\b(?:legacy|deprecated|the old (?:parser|code|way|version)|kept for now'
        .'|until the cutover|stays until a cutover)\b/i';

    /**
     * Files that name another program's older protocol in its own words, each with the program it describes.
     */
    private const array OTHER_PROGRAMS = [
        'app/Mcp/Support/Frame.php' => 'an MCP client that still sends the initialize of an earlier MCP protocol',
        'app/Mcp/Support/RelayFrames.php' => 'the same MCP initialize, relayed',
        'app/Support/Drivers/CodexSkills.php' => "Codex's own earlier skills folder",
        'app/Support/Rules/PackageRules.php' => "npm's --legacy-peer-deps flag",
    ];

    public function test_no_name_or_comment_marks_code_as_old(): void
    {
        $found = [];

        foreach (DomainFiles::in([app_path(), ...glob(base_path('domain/*/src')) ?: []]) as $file) {
            $relative = str_replace(base_path().'/', '', $file);

            if (! array_key_exists($relative, self::OTHER_PROGRAMS)) {
                array_push($found, ...array_map(
                    fn (int $line) => "{$relative}:{$line}",
                    self::oldMarksIn((string) file_get_contents($file)),
                ));
            }
        }

        $this->assertSame([], $found);
    }

    public function test_an_old_name_and_an_old_comment_are_found(): void
    {
        $source = "<?php\n// The old parser's answer, kept for now.\nfinal class LegacyCard {}\nfunction fresh(): void {}\n";

        $this->assertSame([2, 3], self::oldMarksIn($source));
    }

    /**
     * The lines where a declared name or a comment marks code as old.
     *
     * @return list<int>
     */
    private static function oldMarksIn(string $source): array
    {
        $lines = [];

        foreach (token_get_all($source) as $token) {
            if (! is_array($token)) {
                continue;
            }

            $isOldName = $token[0] === T_STRING && preg_match(self::OLD_NAME, $token[1]) === 1;
            $isOldComment = in_array($token[0], [T_COMMENT, T_DOC_COMMENT], true)
                && preg_match(self::OLD_COMMENT, $token[1]) === 1;

            if ($isOldName || $isOldComment) {
                $lines[] = $token[2];
            }
        }

        return array_values(array_unique($lines));
    }
}
