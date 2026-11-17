<?php

declare(strict_types=1);

namespace App\Domain;

use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Support\AssigneeRegistration;
use App\Core\Ui\Declarations\DomainUi;
use App\Core\Ui\Declarations\NavigationItem;
use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Section;
use App\Domain\Contracts\Domain;
use App\Domain\Contracts\ProvidesAssignables;
use App\Domain\Contracts\ProvidesAssignees;
use App\Domain\Exceptions\DomainRequiresItself;
use App\Domain\Exceptions\NotADomain;
use App\Domain\Exceptions\RequiredDomainTwice;
use Illuminate\Support\Str;
use ReflectionClass;

/**
 * One registered domain: its name, namespace and folder, read from its Domain class.
 */
final readonly class DomainEntry
{
    /**
     * @param  list<class-string<Domain>>  $requires
     * @param  list<string>  $exports
     */
    private function __construct(
        public string $name,
        public string $namespace,
        public string $folder,
        public Domain $domain,
        public array $requires,
        public array $exports,
    ) {}

    /**
     * Reads a Domain class and refuses a declaration the application cannot start with.
     */
    public static function fromClass(string $className): self
    {
        if (! is_subclass_of($className, Domain::class)) {
            throw NotADomain::for($className);
        }

        $class = new ReflectionClass($className);
        $file = $class->getFileName();

        if ($file === false) {
            throw NotADomain::for($className);
        }

        $domain = $class->newInstance();
        $name = self::nameOf($className);
        $namespace = $class->getNamespaceName();

        return new self(
            name: $name,
            namespace: $namespace,
            folder: dirname($file),
            domain: $domain,
            requires: self::checkedRequirements($name, $className, $domain->requires()),
            exports: Exports::check($name, $namespace, $domain->exports()),
        );
    }

    /**
     * The domain name: the last segment of the Domain class namespace.
     */
    public static function nameOf(string $className): string
    {
        return Str::afterLast(Str::beforeLast($className, '\\'), '\\');
    }

    public function className(): string
    {
        return $this->domain::class;
    }

    /**
     * Whether a fully written name lies in this domain, compared without regard to case and on whole segments.
     */
    public function ownsName(string $name): bool
    {
        return stripos(ltrim($name, '\\'), $this->namespace.'\\') === 0;
    }

    /**
     * Whether a fully written name is one of this domain's events: a private one in Events or a public one in Api\\Events.
     */
    public function ownsEvent(string $name): bool
    {
        $name = ltrim($name, '\\');

        return stripos($name, $this->namespace.'\\Events\\') === 0 || stripos($name, $this->namespace.'\\Api\\Events\\') === 0;
    }

    /**
     * Whether a fully written name is on this domain's export list, compared without regard to case.
     */
    public function exportsName(string $name): bool
    {
        return in_array(strtolower(ltrim($name, '\\')), array_map(strtolower(...), $this->exports), true);
    }

    /**
     * Whether this domain's namespace or folder lies inside the other's, or the other way round.
     */
    public function overlaps(self $other): bool
    {
        return $this->ownsName($other->namespace.'\\') || $other->ownsName($this->namespace.'\\')
            || strcasecmp($this->namespace, $other->namespace) === 0
            || $this->holdsFile($other->folder) || $other->holdsFile($this->folder) || $this->folder === $other->folder;
    }

    public function holdsListenerFile(string $path): bool
    {
        return str_starts_with($path, $this->listenerFolder().DIRECTORY_SEPARATOR);
    }

    public function holdsFile(string $path): bool
    {
        return str_starts_with($path, $this->folder.DIRECTORY_SEPARATOR);
    }

    public function requiresDomain(self $other): bool
    {
        return in_array($other->className(), $this->requires, true);
    }

    public function listenerFolder(): string
    {
        return $this->folder.'/Listeners';
    }

    public function migrationFolder(): string
    {
        return $this->folder.'/Database/Migrations';
    }

    /**
     * @param  list<class-string<Domain>>  $requires
     * @return list<class-string<Domain>>
     */
    private static function checkedRequirements(string $name, string $className, array $requires): array
    {
        $seen = [];

        foreach ($requires as $requiredClass) {
            if (! is_subclass_of($requiredClass, Domain::class)) {
                throw NotADomain::for($requiredClass);
            }

            if ($requiredClass === $className) {
                throw DomainRequiresItself::for($name);
            }

            if (in_array($requiredClass, $seen, true)) {
                throw RequiredDomainTwice::for($name, self::nameOf($requiredClass));
            }

            $seen[] = $requiredClass;
        }

        return $seen;
    }

    /**
     * The pages, navigation and sections this domain declares, as Core's UI reads them.
     */
    public function ui(): DomainUi
    {
        return DomainUi::of($this->domain, $this->name, $this->namespace, $this->folder);
    }

    /**
     * The given pages, navigation and sections as this domain's, whatever the domain itself declares.
     *
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     */
    public function declaring(array $pages = [], array $navigation = [], array $sections = []): DomainUi
    {
        return DomainUi::declaring($this->name, $this->namespace, $this->folder, $pages, $navigation, $sections);
    }

    /**
     * The record kinds this domain lets actors hold, each with its provider; none when it declares no ProvidesAssignables.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function assignables(): array
    {
        return $this->domain instanceof ProvidesAssignables ? $this->domain->assignables() : [];
    }

    /**
     * The actor kinds this domain adds as holders of records; none when it declares no ProvidesAssignees.
     *
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array
    {
        return $this->domain instanceof ProvidesAssignees ? $this->domain->assignees() : [];
    }
}
