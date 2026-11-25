<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignableContributor;
use App\Contracts\Assignments\AssignableProvider;
use App\Contracts\Assignments\AssigneeContributor;
use App\Contracts\Assignments\AutoAssignmentProvider;
use App\Contracts\Assignments\InternalAssignableContributor;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandMiddlewareProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Bus\CommandRuleProvider;
use App\Contracts\Events\Event;
use App\Contracts\Records\LinkRecordProvider;
use App\Contracts\Records\RecordProvider;
use App\Contracts\Records\StateProvider;
use App\Contracts\Settings\SettingsDefinition;
use App\Contracts\Settings\SettingsProvider;
use App\Contracts\Sharing\ShareGateway;
use App\Contracts\Sharing\ShareGatewayProvider;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Contracts\Skills\Skill;
use App\Contracts\Skills\SkillConditionProvider;
use App\Contracts\Skills\SkillProvider;
use App\Contracts\Work\IncomingWork;
use App\Contracts\Work\IncomingWorkProvider;
use App\Declarations\DomainClient;
use App\Declarations\Menu;
use App\Declarations\MenuItem;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Declarations\SidebarGroup;
use App\Exceptions\DomainRequiresItself;
use App\Exceptions\NotADomain;
use App\Exceptions\RequiredDomainTwice;
use App\Exceptions\SkillConditionRefused;
use App\Exceptions\SkillDeclarationRefused;
use App\Exceptions\TraitInterfaceMissing;
use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\ExportValidator as ExportsCheck;
use App\Support\States\AgentState;
use App\Values\CommandRule;
use App\Values\PolicyDefinition;
use App\Values\RuleScope;
use App\Values\SkillConditionDefinition;
use App\Values\SkillOwner;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One registered domain: its name, namespace and folder, read from its Domain class.
 */
final readonly class DomainEntry
{
    /**
     * @param  list<class-string<Domain>>  $requires
     * @param  list<class-string<Skill>>  $skills
     * @param  list<SkillConditionDefinition>  $skillConditions
     */
    private function __construct(
        public string $name,
        public string $namespace,
        public string $folder,
        public Domain $domain,
        public array $requires,
        public Exports $exports,
        public SettingsDefinition $settings,
        private array $skills,
        private array $skillConditions,
    ) {}

    /**
     * Reads a Domain class and refuses a declaration the application cannot start with.
     */
    public static function fromClass(string $className): self
    {
        if (! ReflectedType::factory()->isSubclassOf($className, Domain::class)) {
            throw NotADomain::for($className);
        }

        $class = ReflectedType::of($className);

        if ($class->fileName()->isEmpty()) {
            throw NotADomain::for($className);
        }

        $file = $class->fileName()->get();
        $domain = $class->newInstance();
        $name = self::nameOf($className);
        $namespace = $class->namespaceName();

        return new self(
            name: $name,
            namespace: $namespace,
            folder: dirname($file),
            domain: $domain,
            requires: self::checkedRequirements($name, $className, $domain->requires()),
            exports: ExportsCheck::check($name, $namespace, $domain->exports()),
            settings: $domain instanceof SettingsProvider ? $domain->settings() : new EmptySettingsDefinition(),
            skills: $domain instanceof SkillProvider ? self::checkedSkills($name, $namespace, $domain->skills()) : [],
            skillConditions: $domain instanceof SkillConditionProvider ? self::checkedSkillConditions(
                $name,
                $domain->skillConditions(),
            ) : [],
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
     * Whether a fully written name is one of this domain's events: a concrete class of its own that implements Event,
     * wherever it sits; a group type its events implement is a contract.
     */
    public function ownsEvent(string $name): bool
    {
        $className = ltrim($name, '\\');

        if (! $this->ownsName($className) || ! ReflectedType::exists($className)) {
            return false;
        }

        $type = ReflectedType::of($className);

        return $type->isSubclassOf(Event::class) && $type->isInstantiable();
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
     * The names of the domains this domain requires.
     *
     * @return list<string>
     */
    public function requiredNames(): array
    {
        return array_map(self::nameOf(...), $this->requires);
    }

    /**
     * Where the domain's JavaScript, TypeScript and Vue files sit: resources/js beside src in a package, as a Laravel
     * project keeps them, or Resources/js in a flat test module's folder.
     */
    public function scriptFolder(): string
    {
        if ($this->isPackage()) {
            return dirname($this->folder).'/resources/js';
        }

        return $this->folder.'/Resources/js';
    }

    /**
     * Whether the domain is a package whose code sits in src, as every domain in domain/<Name> is.
     */
    private function isPackage(): bool
    {
        return basename($this->folder) === 'src';
    }

    /**
     * The service providers the domain keeps in its Providers folder, registered only when the domain boots.
     *
     * @return list<class-string<ServiceProvider>>
     */
    public function providers(): array
    {
        return FolderClasses::in($this->folder.'/Providers', ServiceProvider::class);
    }

    public function listenerFolder(): string
    {
        return $this->folder.'/Listeners';
    }

    public function migrationFolder(): string
    {
        // A domain package keeps Laravel's own layout beside its src (domain/<Name>/database/migrations); a flat test
        // module keeps them in its class folder.
        if ($this->isPackage()) {
            return dirname(
                $this->folder,
            ).'/database/migrations';
        }

        return $this->folder.'/Database/Migrations';
    }

    /**
     * @param  list<string>  $requires  class names, each refused unless it is another domain
     * @return list<class-string<Domain>>
     */
    private static function checkedRequirements(string $name, string $className, array $requires): array
    {
        $seen = [];

        foreach ($requires as $requiredClass) {
            if (! ReflectedType::factory()->isSubclassOf($requiredClass, Domain::class)) {
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
     * Refuses a declared skill class that is missing, does not implement Skill or lies outside the domain's namespace.
     *
     * @param  list<string>  $skills  class names, each refused unless it is a skill in the domain's own package
     * @return list<class-string<Skill>>
     */
    private static function checkedSkills(string $name, string $namespace, array $skills): array
    {
        $checked = [];

        foreach ($skills as $class) {
            if (! ReflectedType::exists($class) || ReflectedType::of($class)->not()->isClass()) {
                throw SkillDeclarationRefused::for($name, $class, 'no such class exists');
            }

            if (! ReflectedType::factory()->isSubclassOf($class, Skill::class)) {
                throw SkillDeclarationRefused::for($name, $class, 'it does not implement '.Skill::class);
            }

            if (stripos(ltrim($class, '\\'), $namespace.'\\') !== 0) {
                throw SkillDeclarationRefused::for($name, $class, 'it lies outside the domain\'s own package');
            }

            $checked[] = $class;
        }

        return $checked;
    }

    /**
     * Refuses a condition registration whose key lacks the domain's prefix or comes twice, or whose version is below 1;
     * its parameter and evaluator classes are typed by the definition itself.
     *
     * @param  list<SkillConditionDefinition>  $definitions
     * @return list<SkillConditionDefinition>
     */
    private static function checkedSkillConditions(string $name, array $definitions): array
    {
        $prefix = Str::kebab($name).'.';
        $seen = [];

        foreach ($definitions as $definition) {
            $key = $definition->key;

            $reason = match (true) {
                ! str_starts_with($key, $prefix) || preg_match(
                    '/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+(-[a-z0-9]+)*$/D',
                    $key,
                ) !== 1 => "its key does not start with {$prefix}",
                in_array($key, $seen, true) => 'it registers that key twice',
                $definition->version < 1 => 'its version is below 1',
                default => null,
            };

            if ($reason !== null) {
                throw SkillConditionRefused::for($name, $key, $reason);
            }

            $seen[] = $key;
        }

        return $definitions;
    }

    /**
     * The named condition types this domain registers, checked when it was registered; none without
     * SkillConditionProvider.
     *
     * @return list<SkillConditionDefinition>
     */
    public function skillConditions(): array
    {
        return $this->skillConditions;
    }

    /**
     * The skill classes this domain declares, checked when it was registered; none without SkillProvider.
     *
     * @return list<class-string<Skill>>
     */
    public function skills(): array
    {
        return $this->skills;
    }

    /**
     * This domain as a supplier of skills: its name, its package folder and the skill classes it declares; a package in
     * domain/ is first-party, anything else a module.
     */
    public function skillOwner(): SkillOwner
    {
        $sourceRoot = $this->isPackage() ? dirname($this->folder) : $this->folder;

        return new SkillOwner(
            $this->name,
            $sourceRoot,
            $this->skills,
            str_starts_with($sourceRoot, base_path('domain').DIRECTORY_SEPARATOR),
        );
    }

    /**
     * The pages, navigation and sections this domain declares, as Core's client declarations read them.
     */
    public function client(): DomainClient
    {
        return DomainClient::of($this->domain, $this->name, $this->namespace, $this->scriptFolder());
    }

    /**
     * The given pages, navigation and sections as this domain's, whatever the domain itself declares.
     *
     * @param  list<Page>  $pages
     * @param  list<NavigationItem>  $navigation
     * @param  list<Section>  $sections
     * @param  list<SidebarGroup>  $sidebarGroups
     * @param  list<Menu>  $menus
     * @param  list<MenuItem>  $menuItems
     */
    public function declaring(
        array $pages = [],
        array $navigation = [],
        array $sections = [],
        array $sidebarGroups = [],
        array $menus = [],
        array $menuItems = [],
    ): DomainClient {
        return DomainClient::declaring(
            $this->name,
            $this->namespace,
            $this->scriptFolder(),
            $pages,
            $navigation,
            $sections,
            sidebarGroups: $sidebarGroups,
            menus: $menus,
            menuItems: $menuItems,
        );
    }

    /**
     * The record types this domain lets Core read and link, each with its provider; none without LinkRecordProvider.
     *
     * @return array<string, class-string<RecordProvider>>
     */
    public function linkRecords(): array
    {
        return $this->provided(LinkRecordProvider::class)
            ->map(fn (LinkRecordProvider $domain) => $domain->linkRecords())
            ->getOrElse([]);
    }

    /**
     * The record types this domain lets actors hold, each with its provider; none when it declares no
     * AssignableContributor.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function assignables(): array
    {
        return $this->provided(AssignableContributor::class)
            ->map(fn (AssignableContributor $domain) => $domain->assignables())
            ->getOrElse([]);
    }

    /**
     * The incoming work this domain's hooks accept; none without IncomingWorkProvider.
     *
     * @return list<class-string<IncomingWork>>
     */
    public function incomingWork(): array
    {
        return $this->provided(IncomingWorkProvider::class)
            ->map(fn (IncomingWorkProvider $domain) => $domain->incomingWork())
            ->getOrElse([]);
    }

    /**
     * The record types of this domain only Core's own writers assign; none without InternalAssignableContributor.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function internalAssignables(): array
    {
        return $this->provided(InternalAssignableContributor::class)
            ->map(fn (InternalAssignableContributor $domain) => $domain->internalAssignables())
            ->getOrElse([]);
    }

    /**
     * The auto-assigners this domain declares for its record types; none without AutoAssignmentProvider.
     *
     * @return list<AutoAssignerDefinition>
     */
    public function autoAssigners(): array
    {
        return $this->provided(AutoAssignmentProvider::class)
            ->map(fn (AutoAssignmentProvider $domain) => $domain->autoAssigners())
            ->getOrElse([]);
    }

    /**
     * The pools this domain declares for auto-assignment to draw from; none without AutoAssignmentProvider.
     *
     * @return list<PoolDefinition>
     */
    public function assignmentPools(): array
    {
        return $this->provided(AutoAssignmentProvider::class)
            ->map(fn (AutoAssignmentProvider $domain) => $domain->assignmentPools())
            ->getOrElse([]);
    }

    /**
     * The records this domain lets owners share, each with its provider; none without ShareRecordContributor.
     *
     * @return list<ShareRecordDefinition>
     */
    public function shareRecords(): array
    {
        return $this->provided(ShareRecordContributor::class)
            ->map(fn (ShareRecordContributor $domain) => $domain->shareRecords())
            ->getOrElse([]);
    }

    /**
     * The policies this domain registers; none without PolicyProvider.
     *
     * @return list<PolicyDefinition>
     */
    public function policies(): array
    {
        return $this->provided(PolicyProvider::class)
            ->map(fn (PolicyProvider $domain) => $domain->policies())
            ->getOrElse([]);
    }

    /**
     * The share gateways this domain adds, by key; none without ShareGatewayProvider.
     *
     * @return array<string, class-string<ShareGateway>>
     */
    public function shareGateways(): array
    {
        return $this->provided(ShareGatewayProvider::class)
            ->map(fn (ShareGatewayProvider $domain) => $domain->shareGateways())
            ->getOrElse([]);
    }

    /**
     * Adds this domain's MCP tools, resources and overview sections to the registration; none without McpToolProvider.
     */
    public function registerMcpToolsIn(McpRegistration $registration): void
    {
        $provided = $this->provided(McpToolProvider::class);

        if ($provided->isEmpty()) {
            return;
        }

        $domain = $provided->get();

        foreach ($domain->mcpTools() as $tool) {
            $registration->registerTool($tool);
        }

        foreach ($domain->mcpResources() as $resource) {
            $registration->registerResource($resource);
        }

        foreach ($domain->overviewContributions() as $contribution) {
            $registration->registerOverviewContribution($contribution);
        }
    }

    /**
     * The sources this domain offers to search, as its Domain class declares them.
     *
     * @return list<Searchable>
     */
    public function searchables(): array
    {
        return $this->domain->searchables();
    }

    /**
     * Runs this domain's bootstrappers one by one, each built by the container, once its traits found what they
     * need of it.
     *
     * @throws TraitInterfaceMissing
     */
    public function boot(Container $container): void
    {
        $container->make(TraitRequirements::class)->assertMetBy($this->domain::class);

        foreach ($this->domain->bootSteps() as $bootstrapper) {
            $container->make($bootstrapper)($this);
        }
    }

    /**
     * The agent state classes this domain declares; none when it declares no StateProvider.
     *
     * @return list<class-string<AgentState>>
     */
    public function states(): array
    {
        return $this->provided(StateProvider::class)
            ->map(fn (StateProvider $domain) => $domain->states())
            ->getOrElse([]);
    }

    /**
     * The holders of records this domain adds; none when it declares no AssigneeContributor.
     *
     * @return list<AssigneeDefinition>
     */
    public function assignees(): array
    {
        return $this->provided(AssigneeContributor::class)
            ->map(fn (AssigneeContributor $domain) => $domain->assignees())
            ->getOrElse([]);
    }

    /**
     * Whether this domain's actors may take automatically assigned work now; none without AssigneeContributor.
     *
     * @return list<ActivityDefinition>
     */
    public function activities(): array
    {
        return $this->provided(AssigneeContributor::class)
            ->map(fn (AssigneeContributor $domain) => $domain->activities())
            ->getOrElse([]);
    }

    /**
     * The command rules this domain declares for its own drivers, owned by it as a module so they wait for review;
     * none without CommandRuleProvider.
     *
     * @return list<CommandRule>
     */
    public function commandRules(): array
    {
        $scope = RuleScope::module($this->name, '');

        return $this->provided(CommandRuleProvider::class)
            ->map(fn (CommandRuleProvider $domain) => array_map(
                fn (CommandRule $rule) => $rule->ownedBy($scope, $rule->revision),
                $domain->commandRules(),
            ))
            ->getOrElse([]);
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
        return $this->provided(CommandProvider::class)
            ->map(fn (CommandProvider $domain) => $domain->commands())
            ->getOrElse([]);
    }

    /**
     * @return list<MiddlewareDeclaration>
     */
    private function commandMiddleware(): array
    {
        return $this->provided(CommandMiddlewareProvider::class)
            ->map(fn (CommandMiddlewareProvider $domain) => $domain->commandMiddleware())
            ->getOrElse([]);
    }

    /**
     * The domain as the capability contract, when it declares that capability.
     *
     * @template TCapability of object
     *
     * @param  class-string<TCapability>  $contract
     * @return Option<TCapability>
     */
    private function provided(string $contract): Option
    {
        if (ReflectedType::of($contract)->isInstance($this->domain)) {
            return new Some($this->domain);
        }

        return None::create();
    }
}
