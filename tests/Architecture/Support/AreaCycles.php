<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

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
     * Laravel's app/Http is the entry layer: its controllers, middleware and requests reach the areas below them, so its
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

        foreach (DomainFiles::in([$appFolder, ...glob("{$domainFolder}/*/src", GLOB_ONLYDIR) ?: []]) as $path) {
            $user = self::areaOfFile($path, $appFolder, $domainFolder);

            if (in_array($user, [self::CORE_ROOT, self::ENTRY_AREA], true)) {
                continue;
            }

            foreach (NameScan::of(ParsedFile::fromPath($path)) as $use) {
                $used = self::areaOfName($use->name);

                if ($used !== null && $used !== $user && ! isset($edges[$user][$used])) {
                    $edges[$user][$used] = substr($path, strlen(dirname($appFolder)) + 1).":{$use->line} uses {$use->name}";
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

    private static function areaOfFile(string $path, string $appFolder, string $domainFolder): string
    {
        if (str_starts_with($path, $domainFolder.'/')) {
            return 'Domain\\'.explode('/', substr($path, strlen($domainFolder) + 1))[0];
        }

        $parts = explode('/', substr($path, strlen($appFolder) + 1));

        return self::areaOf(count($parts) > 1 ? $parts[0] : null);
    }

    private static function areaOfName(string $name): string|null
    {
        $parts = explode('\\', ltrim($name, '\\'));

        return match ($parts[0]) {
            'Domain' => count($parts) > 2 ? "Domain\\{$parts[1]}" : null,
            'App' => self::areaOf(count($parts) > 2 ? $parts[1] : null),
            default => null,
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
