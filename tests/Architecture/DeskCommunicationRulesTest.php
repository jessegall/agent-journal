<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\FormerPaths;

/**
 * The rules desks and Core communication keep: a desk is never an actor, no code there chooses behaviour by actor
 * type, no interface carries a binding, Core names no domain, and no line runs past 120 characters. Each rule is a
 * check over one file's text, so a planted file that breaks it is caught.
 */
final class DeskCommunicationRulesTest extends TestCase
{
    private const array FOLDERS = ['app/Desks/', 'app/Communication/'];

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
            'a desk that is an actor' => ['implementsActor', <<<'TEXT'
            <?php
            final class Desk implements Actor
            {
            }

            TEXT, [2]],
            'a branch on actor type' => ['comparesActorType', <<<'TEXT'
            <?php
            if ($type === ActorType::Agent) {}

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
            'a long line' => ['runsPastWidth', <<<TEXT
            <?php
            {$long}

            TEXT, [2]],
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
        $files = [];

        // The desk and communication files by the folders they had before the move to Laravel's layout.
        foreach (FormerPaths::filesFrom(self::FOLDERS) as $path) {
            $files[$path] = (string) file_get_contents("{$root}/{$path}");
        }

        return $files;
    }
}
