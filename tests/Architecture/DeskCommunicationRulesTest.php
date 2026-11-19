<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Finder\Finder;

/**
 * The rules desks and Core communication keep: a desk is never an actor, no code there chooses behaviour by actor
 * type, no interface carries a binding, Core names no domain, and no line runs past 120 characters. Each rule is a
 * check over one file's text, so a planted file that breaks it is caught.
 */
final class DeskCommunicationRulesTest extends TestCase
{
    private const array FOLDERS = ['app/Desks', 'app/Communication'];

    private const array RULES = [
        'a desk implements Actor (a desk is not an actor)' => 'implementsActor',
        'compares an actor type (rule 39)' => 'comparesActorType',
        'binds an interface with #[Bind]' => 'bindsInterface',
        'names a domain from Core (rule 26)' => 'namesDomain',
        'runs past 120 characters (rule 38)' => 'runsPastWidth',
    ];

    public function test_desks_and_communication_keep_every_rule(): void
    {
        $broken = [];

        foreach ($this->files() as $path => $source) {
            foreach (self::RULES as $rule => $check) {
                foreach ($this->{$check}($source) as $line) {
                    $broken[] = "{$path}:{$line} {$rule}";
                }
            }
        }

        $this->assertSame([], $broken);
    }

    /**
     * @param  list<int>  $expectedLines
     */
    #[DataProvider('plantedFiles')]
    public function test_each_rule_catches_a_planted_counterexample(
        string $check,
        string $source,
        array $expectedLines,
    ): void {
        $this->assertSame($expectedLines, $this->{$check}($source));
    }

    /**
     * @return array<string, array{string, string, list<int>}>
     */
    public static function plantedFiles(): array
    {
        $long = str_repeat('x', 121);

        return [
            'a desk that is an actor' => ['implementsActor', "<?php\nfinal class Desk implements Actor\n{\n}\n", [2]],
            'a branch on actor type' => ['comparesActorType', "<?php\nif (\$type === ActorType::Agent) {}\n", [2]],
            'a bound interface' => ['bindsInterface', "<?php\n#[Bind(Seats::class)]\ninterface SeatReader {}\n", [2]],
            'a domain import' => ['namesDomain', "<?php\nuse Domain\\Chat\\ChatDomain;\n", [2]],
            'a long line' => ['runsPastWidth', "<?php\n{$long}\n", [2]],
        ];
    }

    /**
     * @return list<int>
     */
    private function implementsActor(string $source): array
    {
        return $this->linesMatching($source, '/^final (readonly )?class \w+ .*implements .*\bActor\b/');
    }

    /**
     * @return list<int>
     */
    private function comparesActorType(string $source): array
    {
        return $this->linesMatching($source, '/(===|!==)\s*ActorType::|ActorType::\w+\s*(===|!==)/');
    }

    /**
     * @return list<int>
     */
    private function bindsInterface(string $source): array
    {
        return str_contains($source, "\ninterface ") ? $this->linesMatching($source, '/^#\[Bind\(/') : [];
    }

    /**
     * @return list<int>
     */
    private function namesDomain(string $source): array
    {
        return $this->linesMatching($source, '/^use Domain\\\\/');
    }

    /**
     * @return list<int>
     */
    private function runsPastWidth(string $source): array
    {
        $lines = [];

        foreach (explode("\n", $source) as $index => $line) {
            if (mb_strlen($line) > 120) {
                $lines[] = $index + 1;
            }
        }

        return $lines;
    }

    /**
     * @return list<int>
     */
    private function linesMatching(string $source, string $pattern): array
    {
        $lines = [];

        foreach (explode("\n", $source) as $index => $line) {
            if (preg_match($pattern, $line) === 1) {
                $lines[] = $index + 1;
            }
        }

        return $lines;
    }

    /**
     * @return array<string, string>
     */
    private function files(): array
    {
        $root = dirname(__DIR__, 2);
        $folders = array_map(fn (string $folder) => "{$root}/{$folder}", self::FOLDERS);
        $finder = Finder::create()->files()->name('*.php')->in($folders);
        $files = [];

        foreach ($finder as $file) {
            $files[substr($file->getPathname(), strlen($root) + 1)] = $file->getContents();
        }

        return $files;
    }
}
