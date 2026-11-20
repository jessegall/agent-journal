<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpOption\None;
use PhpOption\Option;
use Tests\Support\ScanCache\ScanCache;

/**
 * Cycles between areas: each Core area (App\Agents, App\Hooks), each domain (Domain\Plans) and the
 * domain foundation is one unit, and no group of units may reach each other. Type folders inside one area (Contracts,
 * Support, Enums) are filing, not layers, so references between them are never a cycle (question 26).
 */
final readonly class AreaCycles
{
    /**
     * The folder of app that is the domain foundation, not a Core area.
     */
    private const string FOUNDATION_FOLDER = 'Domains';

    /**
     * Core's root lists name every area they compose (CoreApi's exports, Core's commands); they are composition, like
     * bootstrap/domains.php, not a dependency of Core on its areas.
     */
    private const string CORE_ROOT = 'App';

    /**
     * Laravel's app/Http is the entry layer: its controllers, middleware and requests reach the areas below them, so
     * its
     * references are no area's dependency on another.
     */
    private const string ENTRY_AREA = 'App\\Http';

    /**
     * @param  array<string, array<string, string>>  $edges  for each area, the areas it names with one example use
     */
    private function __construct(private array $edges) {}

    /**
     * The areas of app and of the domain folder and the names each uses.
     */
    public static function ofProject(string $appFolder, string $domainFolder): self
    {
        $edges = [];

        $nameUsesByFile = ScanCache::findingsInFolders(
            new NamesUsed(),
            [$appFolder, ...glob("{$domainFolder}/*/src", GLOB_ONLYDIR) ?: []],
        );

        foreach ($nameUsesByFile as $path => $names) {
            $sourceArea = self::areaOfFile($path, $appFolder, $domainFolder);

            if (in_array($sourceArea, [self::CORE_ROOT, self::ENTRY_AREA], true)) {
                continue;
            }

            foreach ($names as $use) {
                $area = self::areaOfName($use->name);

                if ($area->isEmpty()) {
                    continue;
                }

                $dependencyArea = $area->get();

                if ($dependencyArea !== $sourceArea && ! isset($edges[$sourceArea][$dependencyArea])) {
                    $edges[$sourceArea][$dependencyArea] = substr(
                        $path,
                        strlen(dirname($appFolder)) + 1,
                    ).":{$use->line} uses {$use->name}";
                }
            }
        }

        return new self($edges);
    }

    /**
     * @param  array<string, array<string, string>>  $edges
     */
    public static function ofEdges(array $edges): self
    {
        return new self($edges);
    }

    /**
     * Each use by which an area reaches one it must never name, as 'from -> to (use)'.
     *
     * @param  array<string, list<string>>  $forbidden  for each area, the areas it must not name
     * @return list<string>
     */
    public function forbiddenUses(array $forbidden): array
    {
        $uses = [];

        foreach ($forbidden as $from => $areas) {
            foreach (array_intersect_key($this->edges[$from] ?? [], array_flip($areas)) as $to => $exampleUse) {
                $uses[] = "{$from} -> {$to} ({$exampleUse})";
            }
        }

        return $uses;
    }

    /**
     * Every group of two or more areas that reach each other, each with the uses that close it.
     *
     * @return list<string>
     */
    public function cycles(): array
    {
        $cycles = [];

        foreach ($this->stronglyConnectedGroups() as $group) {
            sort($group);
            $uses = [];

            foreach ($group as $from) {
                foreach (array_intersect_key($this->edges[$from] ?? [], array_flip($group)) as $to => $exampleUse) {
                    $uses[] = "{$from} -> {$to} ({$exampleUse})";
                }
            }

            $cycles[] = implode(', ', $group).': '.implode('; ', $uses);
        }

        sort($cycles);

        return $cycles;
    }

    /**
     * Tarjan's strongly connected components, keeping only those of two or more areas.
     *
     * @return list<list<string>>
     */
    private function stronglyConnectedGroups(): array
    {
        $index = 0;
        $indexes = [];
        $lowLinks = [];
        $stack = [];
        $areasOnStack = [];
        $groups = [];

        $visitArea = function (
            string $area,
        ) use (&$visitArea, &$index, &$indexes, &$lowLinks, &$stack, &$areasOnStack, &$groups): void {
            $indexes[$area] = $lowLinks[$area] = $index++;
            $stack[] = $area;
            $areasOnStack[$area] = true;

            foreach (array_keys($this->edges[$area] ?? []) as $next) {
                if (! isset($indexes[$next])) {
                    $visitArea($next);
                    $lowLinks[$area] = min($lowLinks[$area], $lowLinks[$next]);
                } elseif ($areasOnStack[$next] ?? false) {
                    $lowLinks[$area] = min($lowLinks[$area], $indexes[$next]);
                }
            }

            if ($lowLinks[$area] !== $indexes[$area]) {
                return;
            }

            $group = [];

            do {
                $member = array_pop($stack);
                $areasOnStack[$member] = false;
                $group[] = $member;
            } while ($member !== $area);

            if (count($group) > 1) {
                $groups[] = $group;
            }
        };

        foreach (array_keys($this->edges) as $area) {
            if (! isset($indexes[$area])) {
                $visitArea($area);
            }
        }

        return $groups;
    }

    private static function areaOfFile(string $path, string $appFolder, string $domainFolder): string
    {
        if (str_starts_with($path, $domainFolder.'/')) {
            return 'Domain\\'.explode('/', substr($path, strlen($domainFolder) + 1))[0];
        }

        $parts = explode('/', substr($path, strlen($appFolder) + 1));

        return self::areaOf(count($parts) > 1 ? $parts[0] : null);
    }

    /**
     * The project area the name belongs to; none for a name outside app and the domains.
     *
     * @return Option<string>
     */
    private static function areaOfName(string $name): Option
    {
        $parts = explode('\\', ltrim($name, '\\'));

        return match ($parts[0]) {
            'Domain' => count($parts) > 2 ? Option::fromValue("Domain\\{$parts[1]}") : None::create(),
            'App' => Option::fromValue(self::areaOf(count($parts) > 2 ? $parts[1] : null)),
            default => None::create(),
        };
    }

    /**
     * Core's root classes are their own area, the foundation folder is one area, and every other folder of app is a
     * Core area.
     */
    private static function areaOf(string|null $folder): string
    {
        return match ($folder) {
            null => self::CORE_ROOT,
            self::FOUNDATION_FOLDER => 'Domain foundation',
            default => "App\\{$folder}",
        };
    }
}
