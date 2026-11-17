<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\Enum_;
use PhpParser\NodeFinder;
use ReflectionClass;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\FolderKind;
use Tests\Architecture\Support\ParsedFile;
use Tests\TestCase;

/**
 * Every class sits in the folder of its kind. A domain root holds only its Domain class and a Core area root nothing;
 * service providers sit in Providers, and a kind folder such as States or Readers holds only classes of that kind;
 * what helps a kind without being of it sits in that folder's Support subfolder.
 */
final class FolderLayoutTest extends TestCase
{
    public function test_every_domain_root_holds_only_its_domain_class_and_a_core_area_root_nothing(): void
    {
        $loose = [];

        foreach ([...glob(app_path('Domain/*'), GLOB_ONLYDIR) ?: [], ...glob(app_path('Core/*'), GLOB_ONLYDIR) ?: []] as $root) {
            $name = basename($root);

            if (in_array($name, ['Contracts', 'Declarations', 'Enums', 'Exceptions', 'Providers'], true)) {
                continue;
            }

            foreach (glob("{$root}/*.php") ?: [] as $file) {
                if (basename($file) !== "{$name}Domain.php") {
                    $loose[] = substr($file, strlen(base_path()) + 1);
                }
            }
        }

        $this->assertSame([], $loose, "These classes sit loose at a domain or Core area root; move each into the folder of its kind, or that area's Support folder.");
    }

    public function test_every_enum_sits_in_an_enums_folder(): void
    {
        $misplaced = [];

        foreach (DomainFiles::in([app_path('Domain'), app_path('Core')]) as $file) {
            $enums = (new NodeFinder)->findInstanceOf(ParsedFile::fromPath($file)->statements, Enum_::class);

            if ($enums !== [] && basename(dirname($file)) !== 'Enums') {
                $misplaced[] = substr($file, strlen(base_path()) + 1);
            }
        }

        $this->assertSame([], $misplaced, 'These enums sit outside an Enums folder; move each into the Enums folder of its domain or Core area.');
    }

    public function test_every_kind_folder_holds_only_its_own_kind(): void
    {
        $misfits = [];

        foreach (DomainFiles::in([app_path('Domain'), app_path('Core')]) as $file) {
            $kind = FolderKind::ofFolder(dirname($file));

            if ($kind === null) {
                continue;
            }

            foreach ((new NodeFinder)->findInstanceOf(ParsedFile::fromPath($file)->statements, ClassLike::class) as $type) {
                /** @var class-string|null $name */
                $name = $type->namespacedName?->toString();
                $misfit = $name === null ? null : $kind->requirementNotMetBy(new ReflectionClass($name));

                if ($misfit !== null) {
                    $misfits[] = substr($file, strlen(base_path()) + 1)." is not {$misfit}; move it to ".basename(dirname($file)).'/Support';
                }
            }
        }

        $this->assertSame([], $misfits, implode("\n", $misfits));
    }
}
