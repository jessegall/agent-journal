<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\PrivatePlaceScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only the area that owns a private place names it: the accounts belong to Profiles and Hooks, the sharing secrets
 * and tunnel folders to Sharing, the hook runtime folder to Hooks (story 64). The Files area itself is exempt.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app/ and the domains.')]
final class PrivatePlaceOwnerTest extends TestCase
{
    /**
     * The folders, from the project root, that may name each private place.
     */
    private const array OWNERS = [
        'Accounts' => ['app/Profiles/', 'app/Hooks/'],
        'SharingSecrets' => ['app/Sharing/'],
        'SharingTunnels' => ['app/Sharing/'],
        'HookRuntime' => ['app/Hooks/'],
    ];

    public function test_only_the_owner_of_a_private_place_names_it(): void
    {
        $this->assertSame([], self::strangersIn(base_path()));
    }

    public function test_a_private_place_named_outside_its_owner_is_found_and_one_inside_passes(): void
    {
        $project = sys_get_temp_dir().'/private-place-owner-'.bin2hex(random_bytes(6));
        mkdir("{$project}/app/Processes", 0o755, true);
        mkdir("{$project}/app/Profiles", 0o755, true);
        $code = <<<'PHP'
            <?php

            namespace App\Probe;

            use App\Enums\Place;

            function place(): Place
            {
                return Place::Accounts;
            }

            PHP;
        file_put_contents("{$project}/app/Processes/Probe.php", $code);
        file_put_contents("{$project}/app/Profiles/Probe.php", $code);

        try {
            $this->assertSame(['app/Processes/Probe.php:9 names Place::Accounts'], self::strangersIn($project));
        } finally {
            unlink("{$project}/app/Processes/Probe.php");
            unlink("{$project}/app/Profiles/Probe.php");
            rmdir("{$project}/app/Processes");
            rmdir("{$project}/app/Profiles");
            rmdir("{$project}/app");
            rmdir($project);
        }
    }

    /**
     * Each file:line outside its owner's folders that names a private place, with the place it names.
     *
     * @return list<string>
     */
    public static function strangersIn(string $projectRoot): array
    {
        $folders = ["{$projectRoot}/app", ...glob("{$projectRoot}/domain/*/src", GLOB_ONLYDIR) ?: []];
        $strangers = [];

        foreach (ScanCache::findingsByFile(new PrivatePlaceScan(), DomainFiles::in($folders)) as $path => $found) {
            $relative = substr($path, strlen($projectRoot) + 1);

            foreach ($found as $finding) {
                $owners = [...self::OWNERS[$finding['place']], 'app/Files/'];

                if (! array_any($owners, fn (string $owner) => str_starts_with($relative, $owner))) {
                    $strangers[] = "{$relative}:{$finding['line']} names Place::{$finding['place']}";
                }
            }
        }

        return $strangers;
    }
}
