<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Support\AssigneeRegistration;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\MiddlewareDeclaration;
use App\Contracts\Event;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesMcpTools;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Exceptions\DomainRequiresItself;
use App\Domains\Exceptions\NotADomain;
use App\Domains\Exceptions\RequiredDomainTwice;
use App\Domains\Support\Exports as ExportsCheck;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpRegistration;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Records\Contracts\RecordProvider;
use App\Settings\Contracts\ProvidesSettings;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Support\EmptySettingsDefinition;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Support\ShareRecordRegistration;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;
use ReflectionClass;

/**
 * One registered domain: its name, namespace and folder, read from its Domain class.
 */
final readonly class DomainEntry
{
    /**
     * @param  list<class-string<Domain>>  $requires
     */
    private function __construct(
        public string $name,
        public string $namespace,
        public string $folder,
        public Domain $domain,
        public array $requires,
        public Exports $exports,
        private SettingsDefinition $settings,
        private bool $switchable,
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
            exports: ExportsCheck::check($name, $namespace, $domain->exports()),
            settings: $domain instanceof ProvidesSettings ? $domain->settings() : new EmptySettingsDefinition,
            switchable: $domain->canDisable(),
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
     * Whether the owner may switch this domain off, as its Domain class declared once.
     */
    public function canDisable(): bool
    {
        return $this->switchable;
    }

    /**
     * Whether a fully written name lies in this domain, compared without regard to case and on whole segments.
     */
    public function ownsName(string $name): bool
    {
        return stripos(ltrim($name, '\\'), $this->namespace.'\\') === 0;
    }

    /**
     * Whether a fully written name is one of this domain's events: a class of its own that implements Event, wherever
     * it sits.
     */
    public function ownsEvent(string $name): bool
    {
        $name = ltrim($name, '\\');

        return $this->ownsName($name) && is_subclass_of($name, Event::class);
    }

    /**
     * Whether a fully written name is in any of this domain's export lists, compared without regard to case.
     */
    public function exportsName(string $name): bool
    {
        return $this->exports->has($name);
    }

    /**
     * Whether a fully written name is in this domain's exported events.
     */
    public function exportsEvent(string $name): bool
    {
        return $this->exports->hasEvent($name);
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

    /**
     * Where the domain's JavaScript, TypeScript and Vue files sit: resources/js beside src in a package, as a Laravel
     * project keeps them, or Resources/js in a flat test module's folder.
     */
    public function scriptFolder(): string
    {
        return $this->isPackage() ? dirname($this->folder).'/resources/js' : $this->folder.'/Resources/js';
    }

    /**
     * Whether the domain is a package whose code sits in src, as every domain in domain/<Name> is.
     */
    private function isPackage(): bool
    {
        return basename($this->folder) === 'src';
    }

    public function listenerFolder(): string
    {
        return $this->folder.'/Listeners';
    }

    public function migrationFolder(): string
    {
        // A domain package keeps Laravel's own layout beside its src (domain/<Name>/database/migrations); a flat test
        // module keeps them in its class folder.
        return $this->isPackage() ? dirname($this->folder).'/database/migrations' : $this->folder.'/Database/Migrations';
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
        return DomainUi::of($this->domain, $this->name, $this->namespace, $this->scriptFolder());
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
        return DomainUi::declaring($this->name, $this->namespace, $this->scriptFolder(), $pages, $navigation, $sections);
    }

    /**
     * The record types this domain lets Core read and link, each with its provider; none without ProvidesLinkRecords.
     *
     * @return array<string, class-string<RecordProvider>>
     */
    public function linkRecords(): array
    {
        return $this->domain instanceof ProvidesLinkRecords ? $this->domain->linkRecords() : [];
    }

    /**
     * The record types this domain lets actors hold, each with its provider; none when it declares no ProvidesAssignables.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function assignables(): array
    {
        return $this->domain instanceof ProvidesAssignables ? $this->domain->assignables() : [];
    }

    /**
     * Adds this domain's MCP tools, resources and overview sections to the registration; none without ProvidesMcpTools.
     */
    public function registerMcpToolsIn(McpRegistration $registration): void
    {
        if (! $this->domain instanceof ProvidesMcpTools) {
            return;
        }

        foreach ($this->domain->mcpTools() as $tool) {
            $registration->registerTool($tool);
        }

        foreach ($this->domain->mcpResources() as $resource) {
            $registration->registerResource($resource);
        }

        foreach ($this->domain->overviewContributions() as $contribution) {
            $registration->registerOverviewContribution($contribution);
        }
    }

    /**
     * The record types this domain lets the owner share; none without ProvidesShareRecords.
     *
     * @return list<ShareRecordRegistration>
     */
    public function shareRecords(): array
    {
        return $this->domain instanceof ProvidesShareRecords ? $this->domain->shareRecords() : [];
    }

    /**
     * The share gateways this domain brings, each key with its class; none without ProvidesShareGateways.
     *
     * @return array<string, class-string<ShareGateway>>
     */
    public function shareGateways(): array
    {
        return $this->domain instanceof ProvidesShareGateways ? $this->domain->shareGateways() : [];
    }

    /**
     * The settings this domain declares, read once when the domain is registered; none without ProvidesSettings.
     */
    public function settings(): SettingsDefinition
    {
        return $this->settings;
    }

    /**
     * Runs this domain's bootstrappers one by one, each built by the container.
     */
    public function boot(Container $container): void
    {
        foreach ($this->domain->bootSteps() as $bootstrapper) {
            $container->make($bootstrapper)($this);
        }
    }

    /**
     * The agent states this domain declares, each type key with its factory; none when it declares no ProvidesStates.
     *
     * @return array<string, class-string>
     */
    public function states(): array
    {
        return $this->domain instanceof ProvidesStates ? $this->domain->states() : [];
    }

    /**
     * The models this domain numbers; none when it declares no ProvidesNumberedModels.
     *
     * @return list<NumberedModel>
     */
    public function numberedModels(): array
    {
        return $this->domain instanceof ProvidesNumberedModels ? $this->domain->numberedModels() : [];
    }

    /**
     * The actor types this domain adds as holders of records; none when it declares no ProvidesAssignees.
     *
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array
    {
        return $this->domain instanceof ProvidesAssignees ? $this->domain->assignees() : [];
    }

    /**
     * This domain as an owner of commands: the commands and middleware it declares, the owners it requires and what it
     * exports. A domain that declares neither capability owns no commands.
     */
    public function commandOwner(): CommandOwner
    {
        return new CommandOwner(
            name: $this->name,
            namespace: $this->namespace,
            domainClass: $this->className(),
            commands: $this->commands(),
            middleware: $this->commandMiddleware(),
            requires: array_map(self::nameOf(...), $this->requires),
            exports: $this->exports,
        );
    }

    /**
     * @return list<class-string>
     */
    private function commands(): array
    {
        return $this->domain instanceof ProvidesCommands ? $this->domain->commands() : [];
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    private function commandMiddleware(): array
    {
        return $this->domain instanceof ProvidesCommandMiddleware ? $this->domain->commandMiddleware() : [];
    }
}
