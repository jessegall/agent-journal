<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\NodeFinder;
use ReflectionClass;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\FolderType;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every class sits in the folder of its type. A domain root holds only its Domain class and a Core area root nothing;
 * service providers sit in Providers, and a type folder such as States or Readers holds only classes of that type;
 * what helps a type without being of it sits in that folder's Support subfolder.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class FolderLayoutTest extends TestCase
{
    public function test_every_domain_root_holds_only_its_domain_class_and_a_core_area_root_nothing(): void
    {
        $loose = [];

        foreach ([...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: [], ...glob(app_path('*'), GLOB_ONLYDIR) ?: []] as $root) {
            // a domain's root is its src folder, named after the domain's package folder
            $name = basename($root) === 'src' ? basename(dirname($root)) : basename($root);

            if (in_array($name, ['Contracts', 'Declarations', 'Enums', 'Exceptions', 'Providers'], true)) {
                continue;
            }

            foreach (glob("{$root}/*.php") ?: [] as $file) {
                if (basename($file) !== "{$name}Domain.php") {
                    $loose[] = substr($file, strlen(base_path()) + 1);
                }
            }
        }

        $this->assertSame([], $loose, "These classes sit loose at a domain or Core area root; move each into the folder of its type, or that area's Support folder.");
    }

    public function test_no_domain_keeps_an_actions_folder_but_access(): void
    {
        $this->assertSame([], self::actionsFoldersIn(base_path('domain')), 'A domain write is a command with a handler (doc 19); only Access keeps the Actions Fortify calls.');
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
        $folders = array_map(fn (string $folder) => substr($folder, strlen($packages) + 1), glob("{$packages}/*/src/Actions", GLOB_ONLYDIR) ?: []);

        return array_values(array_filter($folders, fn (string $folder) => $folder !== 'Access/src/Actions'));
    }

    public function test_every_enum_sits_in_an_enums_folder(): void
    {
        $misplaced = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $enums = (new NodeFinder)->findInstanceOf(ParsedFile::fromPath($file)->statements, Enum_::class);

            if ($enums !== [] && basename(dirname($file)) !== 'Enums') {
                $misplaced[] = substr($file, strlen(base_path()) + 1);
            }
        }

        $this->assertSame([], $misplaced, 'These enums sit outside an Enums folder; move each into the Enums folder of its domain or Core area.');
    }

    public function test_every_type_folder_holds_only_its_own_type(): void
    {
        $misfits = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $type = FolderType::ofFolder(dirname($file));

            if ($type === null) {
                continue;
            }

            foreach ((new NodeFinder)->findInstanceOf(ParsedFile::fromPath($file)->statements, ClassLike::class) as $declaration) {
                /** @var class-string|null $name */
                $name = $declaration->namespacedName?->toString();
                $misfit = $name === null ? null : $type->requirementNotMetBy(new ReflectionClass($name));

                if ($misfit !== null) {
                    $misfits[] = substr($file, strlen(base_path()) + 1)." is not {$misfit}; move it to ".basename(dirname($file)).'/Support';
                }
            }
        }

        $this->assertSame([], $misfits, implode("\n", $misfits));
    }
}
