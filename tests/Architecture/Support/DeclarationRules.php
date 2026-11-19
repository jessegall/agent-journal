<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Domains\Support\Domain;
use App\Domains\Support\DomainEntry;
use ReflectionClass;
use Tests\Support\ScanCache\ScanCache;

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

        foreach (ScanCache::findingsByFile(new ClassesDeclared(), $files) as $path => $classes) {
            foreach ($classes as $name) {
                if (! is_subclass_of($name, Domain::class)
                    || ($reflection = new ReflectionClass($name))->isAbstract()) {
                    continue;
                }

                if (preg_match('/^'.preg_quote($root, '/').'\\\\(\w+)\\\\\1Domain$/', $name) !== 1) {
                    $violations[] = new Violation(
                        $path,
                        (int) $reflection->getStartLine(),
                        $name,
                        'none',
                        'none',
                        ViolationType::MisnamedDomainClass,
                    );
                }
            }
        }

        return $violations;
    }

    /**
     * Files of the application folder that lie in no domain, in none of the shared places and not on the starter-kit
     * list.
     *
     * @param  list<string>  $files
     * @param  list<string>  $sharedFolders
     * @param  list<string>  $starterKitFiles
     * @return list<Violation>
     */
    public function filesOutsideDomains(array $files, array $sharedFolders, array $starterKitFiles): array
    {
        $violations = [];

        foreach ($files as $path) {
            if ($this->isInADomain($path)
                || $this->liesIn($path, $sharedFolders)
                || in_array($path, $starterKitFiles, true)) {
                continue;
            }

            $violations[] = new Violation($path, 1, $path, 'none', 'none', ViolationType::FileOutsideDomains);
        }

        return $violations;
    }

    /**
     * @param  list<string>  $folders
     */
    private function liesIn(string $path, array $folders): bool
    {
        return array_any($folders, fn (string $folder) => str_starts_with($path, $folder.'/'));
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
                $violations[] = new Violation(
                    $use->file,
                    $use->line,
                    $use->name,
                    'starter kit',
                    $owner->name,
                    ViolationType::StarterKitUsesDomain,
                );
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
            foreach (ScanCache::findingsInFolders(new NamespacesDeclared(), [$entry->folder]) as $path => $namespaces) {
                foreach ($namespaces as $namespace) {
                    $name = $namespace['name'] === '' ? 'the global namespace' : $namespace['name'];

                    if (! $entry->ownsName($name.'\\')) {
                        $violations[] = new Violation(
                            $path,
                            $namespace['line'],
                            $name,
                            $entry->name,
                            $entry->namespace,
                            ViolationType::NamespaceOutsideDomain,
                        );
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
            if ($this->isInADomain($path)) {
                continue;
            }

            if (! in_array(substr($path, strlen($sharedFolder) + 1), $fixedFiles, true)) {
                $violations[] = new Violation(
                    $path,
                    1,
                    $path,
                    'App\Domain',
                    'App\Domain',
                    ViolationType::SharedPlaceFile,
                );
            }
        }

        return $violations;
    }

    private function isInADomain(string $path): bool
    {
        return array_any($this->entries, fn (DomainEntry $entry) => $entry->holdsFile($path));
    }
}
