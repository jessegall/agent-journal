<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Console\Commands\GenerateCallsCommand;
use App\Support\ReflectedType;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\FolderType;
use Tests\Architecture\Support\LayoutRoots;
use Tests\Architecture\Support\TypesDeclared;
use Tests\Fixtures\Bus\Layouts\Commands\Plant\PlantCommand;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every class sits in the folder of its type. A domain root holds only its Domain class beside its role folders;
 * service providers sit in Providers, and a type folder such as States or Readers holds only classes of that type;
 * what helps a type without being of it sits in that folder's Support subfolder.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class FolderLayoutTest extends TestCase
{
    private const string MISPLACED_ROOTS = 'app and a package src hold only role folders and their root files; '
        .'a class moves into the folder of its type.';

    private const string ACTIONS_FOLDER = 'A domain write is a command with a handler (doc 19); '
        .'only Access keeps the Actions Fortify calls.';

    private const string LOOSE_ENUMS = 'These enums sit outside an Enums folder; '
        .'move each into the Enums folder of its domain or Core area.';

    public function test_app_and_each_package_src_hold_only_role_folders_and_their_root_files(): void
    {
        $misplaced = self::misplacedUnder(app_path(), LayoutRoots::core(), LayoutRoots::coreRootFiles());

        foreach (glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: [] as $source) {
            $name = basename(dirname($source));
            $misplaced = [...$misplaced, ...self::misplacedUnder($source, LayoutRoots::package(), ["{$name}Domain.php"])];
        }

        $this->assertSame([], $misplaced, self::MISPLACED_ROOTS);
    }

    public function test_a_new_old_area_folder_is_reported_and_its_move_to_a_role_clears_it(): void
    {
        $roots = LayoutRoots::core();

        $this->assertSame(['Gardening'], $roots->misplaced(['Models', 'Gardening'], [], []));
        $this->assertSame([], $roots->misplaced(['Models'], [], []));
        $this->assertSame(['Loose.php'], $roots->misplaced([], ['CoreCommands.php', 'Loose.php'], LayoutRoots::coreRootFiles()));
    }

    /**
     * The misplaced folders and files under one root.
     *
     * @param  list<string>  $rootFiles
     * @return list<string>
     */
    private static function misplacedUnder(string $root, LayoutRoots $roots, array $rootFiles): array
    {
        $folders = array_map(basename(...), glob("{$root}/*", GLOB_ONLYDIR) ?: []);
        $files = array_map(basename(...), glob("{$root}/*.php") ?: []);
        $relative = substr($root, strlen(base_path()) + 1);

        return array_map(fn (string $name) => "{$relative}/{$name}", $roots->misplaced($folders, $files, $rootFiles));
    }

    public function test_no_domain_keeps_an_actions_folder_but_access(): void
    {
        $this->assertSame(
            [],
            self::actionsFoldersIn(base_path('domain')),
            self::ACTIONS_FOLDER,
        );
    }

    public function test_an_actions_folder_in_a_domain_is_named(): void
    {
        $sample = sys_get_temp_dir().'/domain-with-actions';
        @mkdir("{$sample}/Shop/src/Actions", 0777, true);

        try {
            $this->assertSame(['Shop/src/Actions'], self::actionsFoldersIn($sample));
        } finally {
            @rmdir("{$sample}/Shop/src/Actions");
            @rmdir("{$sample}/Shop/src");
            @rmdir("{$sample}/Shop");
            @rmdir($sample);
        }
    }

    /**
     * Every Actions folder of a domain package, relative to the folder of the packages, except Access's.
     *
     * @return list<string>
     */
    private static function actionsFoldersIn(string $packages): array
    {
        $folders = array_map(
            fn (string $folder) => substr($folder, strlen($packages) + 1),
            glob("{$packages}/*/src/Actions", GLOB_ONLYDIR) ?: [],
        );

        return array_values(array_filter($folders, fn (string $folder) => $folder !== 'Access/src/Actions'));
    }

    public function test_every_enum_sits_in_an_enums_folder(): void
    {
        $misplaced = [];

        foreach (ScanCache::findingsInFolders(
            new TypesDeclared(),
            [app_path(), ...DomainFiles::domainCode()],
        ) as $file => $types) {
            $declaresEnum = array_any($types, fn (array $type) => $type['enum']);

            if ($declaresEnum && ! str_contains(dirname($file).'/', '/Enums/')) {
                $misplaced[] = substr($file, strlen(base_path()) + 1);
            }
        }

        $this->assertSame(
            [],
            $misplaced,
            self::LOOSE_ENUMS,
        );
    }

    public function test_a_bus_pair_and_an_artisan_adapter_are_each_refused_in_the_others_folder(): void
    {
        $adapterFolder = FolderType::ofFile(app_path('Console/Commands/PlantCommand.php'));
        $pairFolder = FolderType::ofFile(app_path('Commands/Plant/PlantCommand.php'));

        $this->assertSame(FolderType::ArtisanCommands, $adapterFolder);
        $this->assertSame(FolderType::Commands, $pairFolder);
        $this->assertNull($adapterFolder->requirementNotMetBy(ReflectedType::of(GenerateCallsCommand::class)));
        $this->assertNull($pairFolder->requirementNotMetBy(ReflectedType::of(PlantCommand::class)));
        $this->assertNotNull($adapterFolder->requirementNotMetBy(ReflectedType::of(PlantCommand::class)));
        $this->assertNotNull($pairFolder->requirementNotMetBy(ReflectedType::of(GenerateCallsCommand::class)));
    }

    public function test_every_type_folder_holds_only_its_own_type(): void
    {
        $misfits = [];

        foreach (ScanCache::findingsInFolders(
            new TypesDeclared(),
            [app_path(), ...DomainFiles::domainCode()],
        ) as $file => $declarations) {
            $type = FolderType::ofFile($file);

            if ($type === null) {
                continue;
            }

            foreach ($declarations as $declaration) {
                /**
                 * @var class-string $name
                 */
                $name = $declaration['name'];
                $misfit = $type->requirementNotMetBy(ReflectedType::of($name));

                if ($misfit !== null) {
                    $misfits[] = substr(
                        $file,
                        strlen(base_path()) + 1,
                    )." is not {$misfit}; move it to ".basename(dirname($file)).'/Support';
                }
            }
        }

        $this->assertSame([], $misfits, implode("\n", $misfits));
    }
}
