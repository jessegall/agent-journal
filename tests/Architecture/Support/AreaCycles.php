<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * Cycles between areas: each Core area (App\Core\Agents, App\Core\Hooks), each domain (App\Domain\Plans) and the
 * domain foundation is one unit, and no group of units may reach each other. Kind folders inside one area (Contracts,
 * Support, Enums) are filing, not layers, so references between them are never a cycle (question 26).
 */
final readonly class AreaCycles
{
    /**
     * The folders at the root of app/Domain that are the domain foundation, not a domain.
     */
    private const array FOUNDATION_FOLDERS = ['Contracts', 'Exceptions', 'Providers'];

    /**
     * @param  array<string, array<string, string>>  $edges  for each area, the areas it names with one example use
     */
    private function __construct(private array $edges) {}

    /**
     * The areas of app/Core and app/Domain and the names each uses.
     */
    public static function ofProject(string $appFolder): self
    {
        $edges = [];

        foreach (DomainFiles::in([$appFolder.'/Core', $appFolder.'/Domain']) as $path) {
            $user = self::areaOfFile($path, $appFolder);

            foreach (NameScan::of(ParsedFile::fromPath($path)) as $use) {
                $used = self::areaOfName($use->name);

                if ($used !== null && $used !== $user && ! isset($edges[$user][$used])) {
                    $edges[$user][$used] = substr($path, strlen($appFolder) + 1).":{$use->line} uses {$use->name}";
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
                foreach (array_intersect_key($this->edges[$from] ?? [], array_flip($group)) as $to => $example) {
                    $uses[] = "{$from} -> {$to} ({$example})";
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
        $lowest = [];
        $stack = [];
        $onStack = [];
        $groups = [];

        $visit = function (string $area) use (&$visit, &$index, &$indexes, &$lowest, &$stack, &$onStack, &$groups): void {
            $indexes[$area] = $lowest[$area] = $index++;
            $stack[] = $area;
            $onStack[$area] = true;

            foreach (array_keys($this->edges[$area] ?? []) as $next) {
                if (! isset($indexes[$next])) {
                    $visit($next);
                    $lowest[$area] = min($lowest[$area], $lowest[$next]);
                } elseif ($onStack[$next] ?? false) {
                    $lowest[$area] = min($lowest[$area], $indexes[$next]);
                }
            }

            if ($lowest[$area] !== $indexes[$area]) {
                return;
            }

            $group = [];

            do {
                $member = array_pop($stack);
                $onStack[$member] = false;
                $group[] = $member;
            } while ($member !== $area);

            if (count($group) > 1) {
                $groups[] = $group;
            }
        };

        foreach (array_keys($this->edges) as $area) {
            if (! isset($indexes[$area])) {
                $visit($area);
            }
        }

        return $groups;
    }

    private static function areaOfFile(string $path, string $appFolder): string
    {
        $parts = explode('/', substr($path, strlen($appFolder) + 1));

        return self::areaOf($parts[0], count($parts) > 2 ? $parts[1] : null);
    }

    private static function areaOfName(string $name): string|null
    {
        $parts = explode('\\', $name);

        if ($parts[0] !== 'App' || ! in_array($parts[1] ?? '', ['Core', 'Domain'], true)) {
            return null;
        }

        return self::areaOf($parts[1], count($parts) > 3 ? $parts[2] : null);
    }

    /**
     * Core's root and the foundation's root classes are their own areas; every folder below Core is an area, and
     * every folder below Domain is a domain unless it is one of the foundation's.
     */
    private static function areaOf(string $root, string|null $folder): string
    {
        if ($root === 'Domain' && ($folder === null || in_array($folder, self::FOUNDATION_FOLDERS, true))) {
            return 'Domain foundation';
        }

        return $folder === null ? $root : "{$root}\\{$folder}";
    }
}
