<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\DomainFiles;

/**
 * Rules over the text of every Core file: a desk is never an actor, no interface carries a binding, and Core names
 * no domain; ActorCategoryRuleTest keeps code from choosing by the type of actor. A planted file that breaks a rule is caught.
 */
final class CoreTextRulesTest extends TestCase
{
    private const array RULES = [
        'a desk implements Actor (a desk is not an actor)' => 'implementsActor',
        'binds an interface with #[Bind]' => 'bindsInterface',
        'names a domain from Core (rule 26)' => 'namesDomain',
    ];

    public function test_core_keeps_every_rule(): void
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
        return [
            'a desk that is an actor' => ['implementsActor', <<<'TEXT'
            <?php
            final class Desk implements Actor
            {
            }

            TEXT, [2]],
            'a bound interface' => ['bindsInterface', <<<'TEXT'
            <?php
            #[Bind(Seats::class)]
            interface SeatReader {}

            TEXT, [2]],
            'a domain import' => ['namesDomain', <<<'TEXT'
            <?php
            use Domain\Chat\ChatDomain;

            TEXT, [2]],
        ];
    }

    /**
     * @return list<int>
     */
    private function implementsActor(string $source): array
    {
        return $this->linesMatching($source, '/^final (readonly )?class \w*Desk\w* .*implements .*\bActor\b/');
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
        $files = [];

        foreach (DomainFiles::in(["{$root}/app"]) as $path) {
            $files[substr($path, strlen($root) + 1)] = (string) file_get_contents($path);
        }

        return $files;
    }
}
