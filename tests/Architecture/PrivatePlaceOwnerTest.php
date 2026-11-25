<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\PrivatePlaceScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Only the subject that owns a private place names it: the accounts belong to accounts, profiles, sign-in, drivers and
 * hooks, the sharing secrets and tunnel folders to sharing and its gateways, the hook runtime folder to hooks and the
 * relay (story 64), and the file primitives behind the Files contract name every place.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of app/ and the domains.')]
final class PrivatePlaceOwnerTest extends TestCase
{
    /**
     * The subject words of the file paths that may name each private place: accounts, their sign-in and the drivers
     * that run in them; sharing and its gateways; hooks and the relay that runs them.
     */
    private const array OWNERS = [
        'Accounts' => '#Account|Profile|Hook|SignIn|Driver#',
        'SharingSecrets' => '#Shar(e|ing)|Gateway#',
        'SharingTunnels' => '#Shar(e|ing)|Gateway#',
        'HookRuntime' => '#Hook|Relay#',
    ];

    /**
     * The file primitives behind the Files contract, which name every place.
     */
    private const string FILE_PRIMITIVES = '#^app/(Support/(LocalFiles|PlaceRoots|PathConfinement)|Enums/Place)\.php$#';

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

            use App\Enums\Files\Place;

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
                $owned = preg_match(self::OWNERS[$finding['place']], "/{$relative}") === 1
                    || preg_match(self::FILE_PRIMITIVES, $relative) === 1;

                if (! $owned) {
                    $strangers[] = "{$relative}:{$finding['line']} names Place::{$finding['place']}";
                }
            }
        }

        return $strangers;
    }
}
