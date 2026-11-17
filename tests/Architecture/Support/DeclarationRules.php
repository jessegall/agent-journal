<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domain\Domain;
use App\Domain\DomainEntry;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\Namespace_;
use PhpParser\NodeFinder;
use ReflectionClass;

/**
 * The rules about where code is declared: Domain class names, the files outside domains, namespaces, the shared place.
 */
final readonly class DeclarationRules
{
    /**
     * @param  list<DomainEntry>  $entries
     */
    public function __construct(
        private array $entries,
        private ProjectRoots $roots,
    ) {}

    /**
     * Every concrete Domain class in the files, found by reflection, is named <root>\<Name>\<Name>Domain.
     *
     * @param  list<string>  $files
     * @return list<Violation>
     */
    public function misnamedDomainClasses(array $files, string $root): array
    {
        $violations = [];

        foreach ($files as $path) {
            foreach ((new NodeFinder)->findInstanceOf(ParsedFile::fromPath($path)->statements, Class_::class) as $class) {
                $name = $class->namespacedName?->toString();

                if ($name === null || ! is_subclass_of($name, Domain::class) || (new ReflectionClass($name))->isAbstract()) {
                    continue;
                }

                if (preg_match('/^'.preg_quote($root, '/').'\\\\(\w+)\\\\\1Domain$/', $name) !== 1) {
                    $violations[] = new Violation($path, $class->getStartLine(), $name, 'none', 'none', ViolationKind::MisnamedDomainClass);
                }
            }
        }

        return $violations;
    }

    /**
     * Files of the application folder that lie in no domain, not in the shared place and not on the starter-kit list.
     *
     * @param  list<string>  $files
     * @param  list<string>  $starterKitFiles
     * @return list<Violation>
     */
    public function filesOutsideDomains(array $files, string $sharedFolder, array $starterKitFiles): array
    {
        $violations = [];

        foreach ($files as $path) {
            if ($this->domainHolding($path) !== null || str_starts_with($path, $sharedFolder.'/') || in_array($path, $starterKitFiles, true)) {
                continue;
            }

            $violations[] = new Violation($path, 1, $path, 'none', 'none', ViolationKind::FileOutsideDomains);
        }

        return $violations;
    }

    /**
     * @param  list<string>  $starterKitFiles
     * @return list<Violation>
     */
    public function starterKitDomainUses(array $starterKitFiles): array
    {
        $violations = [];

        foreach (DomainFiles::usesIn($starterKitFiles, $this->roots) as $use) {
            $owner = array_find($this->entries, fn (DomainEntry $entry) => $entry->ownsName($use->name));

            if ($owner !== null) {
                $violations[] = new Violation($use->file, $use->line, $use->name, 'starter kit', $owner->name, ViolationKind::StarterKitUsesDomain);
            }
        }

        return $violations;
    }

    /**
     * Every file in a domain folder declares a namespace inside that domain.
     *
     * @return list<Violation>
     */
    public function namespacesOutsideDomains(): array
    {
        $violations = [];

        foreach ($this->entries as $entry) {
            foreach (DomainFiles::in([$entry->folder]) as $path) {
                foreach ((new NodeFinder)->findInstanceOf(ParsedFile::fromPath($path)->statements, Namespace_::class) as $namespace) {
                    $name = $namespace->name?->toString() ?? 'the global namespace';

                    if (! $entry->ownsName($name.'\\')) {
                        $violations[] = new Violation($path, $namespace->getStartLine(), $name, $entry->name, $entry->namespace, ViolationKind::NamespaceOutsideDomain);
                    }
                }
            }
        }

        return $violations;
    }

    /**
     * The domain foundation holds exactly its fixed files beside the domain folders, given relative to its folder.
     *
     * @param  list<string>  $fixedFiles
     * @return list<Violation>
     */
    public function extraSharedFiles(string $sharedFolder, array $fixedFiles): array
    {
        $violations = [];

        foreach (DomainFiles::allIn($sharedFolder) as $path) {
            if ($this->domainHolding($path) !== null) {
                continue;
            }

            if (! in_array(substr($path, strlen($sharedFolder) + 1), $fixedFiles, true)) {
                $violations[] = new Violation($path, 1, $path, 'App\Domain', 'App\Domain', ViolationKind::SharedPlaceFile);
            }
        }

        return $violations;
    }

    private function domainHolding(string $path): ?DomainEntry
    {
        return array_find($this->entries, fn (DomainEntry $entry) => $entry->holdsFile($path));
    }
}
