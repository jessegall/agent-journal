<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Assignments\Contracts\AssignableProvider;
use App\Assignments\Contracts\ProvidesAutoAssignments;
use App\Assignments\Support\ActivityRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Assignments\Support\AutoAssignerDefinition;
use App\Assignments\Support\PoolDefinition;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandOwner;
use App\Bus\Support\MiddlewareDeclaration;
use App\Contracts\Event;
use App\Domains\Contracts\ProvidesAssignables;
use App\Domains\Contracts\ProvidesAssignees;
use App\Domains\Contracts\ProvidesIncomingWork;
use App\Domains\Contracts\ProvidesInternalAssignables;
use App\Domains\Contracts\ProvidesLinkRecords;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Exceptions\DomainRequiresItself;
use App\Domains\Exceptions\NotADomain;
use App\Domains\Exceptions\RequiredDomainTwice;
use App\Domains\Exceptions\SkillConditionRefused;
use App\Domains\Exceptions\SkillDeclarationRefused;
use App\Domains\Support\Exports as ExportsCheck;
use App\Exports\Support\Exports;
use App\Hooks\Contracts\IncomingWork;
use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Contracts\ProvidesMcpTools;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Processes\Contracts\ProvidesCommandRules;
use App\Processes\Values\CommandRule;
use App\Processes\Values\RuleScope;
use App\Records\Contracts\RecordProvider;
use App\Settings\Contracts\ProvidesSettings;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Support\EmptySettingsDefinition;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Support\ShareRecordRegistration;
use App\Skills\Contracts\ProvidesSkillConditions;
use App\Skills\Contracts\ProvidesSkills;
use App\Skills\Contracts\Skill;
use App\Skills\Contracts\SkillConditionEvaluator;
use App\Skills\Values\SkillConditionRegistration;
use App\Skills\Values\SkillOwner;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;
use ReflectionClass;
use Spatie\LaravelData\Data;

/**
 * One registered domain: its name, namespace and folder, read from its Domain class.
 */
final readonly class DomainEntry
{
    /**
     * @param  list<class-string<Domain>>  $requires
     * @param  list<class-string<Skill>>  $skills
     * @param  list<SkillConditionRegistration>  $skillConditions
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
        private array $skills,
        private array $skillConditions,
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
            settings: $domain instanceof ProvidesSettings ? $domain->settings() : new EmptySettingsDefinition(),
            switchable: $domain->canDisable(),
            skills: $domain instanceof ProvidesSkills ? self::checkedSkills($name, $namespace, $domain->skills()) : [],
            skillConditions: $domain instanceof ProvidesSkillConditions ? self::checkedSkillConditions(
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
        $className = ltrim($name, '\\');

        return $this->ownsName($className) && is_subclass_of($className, Event::class);
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
        return $this->isPackage() ? dirname(
            $this->folder,
        ).'/database/migrations' : $this->folder.'/Database/Migrations';
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
     * Refuses a declared skill class that is missing, does not implement Skill or lies outside the domain's namespace.
     *
     * @param  list<class-string<Skill>>  $skills
     * @return list<class-string<Skill>>
     */
    private static function checkedSkills(string $name, string $namespace, array $skills): array
    {
        foreach ($skills as $class) {
            if (! class_exists($class)) {
                throw SkillDeclarationRefused::for($name, $class, 'no such class exists');
            }

            if (! is_subclass_of($class, Skill::class)) {
                throw SkillDeclarationRefused::for($name, $class, 'it does not implement '.Skill::class);
            }

            if (stripos(ltrim($class, '\\'), $namespace.'\\') !== 0) {
                throw SkillDeclarationRefused::for($name, $class, 'it lies outside the domain\'s own package');
            }
        }

        return $skills;
    }

    /**
     * Refuses a condition registration whose key lacks the domain's prefix or comes twice, or whose parameter or
     * evaluator class is not what the contract asks.
     *
     * @param  list<SkillConditionRegistration>  $registrations
     * @return list<SkillConditionRegistration>
     */
    private static function checkedSkillConditions(string $name, array $registrations): array
    {
        $prefix = Str::kebab($name).'.';
        $seen = [];

        foreach ($registrations as $registration) {
            $key = $registration->key;
            $reason = match (true) {
                ! str_starts_with($key, $prefix) || preg_match(
                    '/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+(-[a-z0-9]+)*$/D',
                    $key,
                ) !== 1 => "its key does not start with {$prefix}",
                in_array($key, $seen, true) => 'it registers that key twice',
                ! is_subclass_of(
                    $registration->parameters,
                    Data::class,
                ) => 'its parameters class is no Spatie Data class',
                ! is_subclass_of(
                    $registration->evaluator,
                    SkillConditionEvaluator::class,
                ) => 'its evaluator does not implement App\\Skills\\Contracts\\SkillConditionEvaluator',
                $registration->version < 1 => 'its version is below 1',
                default => null,
            };

            if ($reason !== null) {
                throw SkillConditionRefused::for($name, $key, $reason);
            }

            $seen[] = $key;
        }

        return $registrations;
    }

    /**
     * The named condition types this domain registers, checked when it was registered; none without
     * ProvidesSkillConditions.
     *
     * @return list<SkillConditionRegistration>
     */
    public function skillConditions(): array
    {
        return $this->skillConditions;
    }

    /**
     * The skill classes this domain declares, checked when it was registered; none without ProvidesSkills.
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
        return DomainUi::declaring(
            $this->name,
            $this->namespace,
            $this->scriptFolder(),
            $pages,
            $navigation,
            $sections,
        );
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
     * The record types this domain lets actors hold, each with its provider; none when it declares no
     * ProvidesAssignables.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function assignables(): array
    {
        return $this->domain instanceof ProvidesAssignables ? $this->domain->assignables() : [];
    }

    /**
     * The incoming work this domain's hooks accept; none without ProvidesIncomingWork.
     *
     * @return list<class-string<IncomingWork>>
     */
    public function incomingWork(): array
    {
        return $this->domain instanceof ProvidesIncomingWork ? $this->domain->incomingWork() : [];
    }

    /**
     * The record types of this domain only Core's own writers assign; none without ProvidesInternalAssignables.
     *
     * @return array<string, class-string<AssignableProvider>>
     */
    public function internalAssignables(): array
    {
        return $this->domain instanceof ProvidesInternalAssignables ? $this->domain->internalAssignables() : [];
    }

    /**
     * The auto-assigners this domain declares for its record types; none without ProvidesAutoAssignments.
     *
     * @return list<AutoAssignerDefinition>
     */
    public function autoAssigners(): array
    {
        return $this->domain instanceof ProvidesAutoAssignments ? $this->domain->autoAssigners() : [];
    }

    /**
     * The pools this domain declares for auto-assignment to draw from; none without ProvidesAutoAssignments.
     *
     * @return list<PoolDefinition>
     */
    public function assignmentPools(): array
    {
        return $this->domain instanceof ProvidesAutoAssignments ? $this->domain->assignmentPools() : [];
    }

    /**
     * The records this domain lets owners share, each with its provider; none without ProvidesShareRecords.
     *
     * @return list<ShareRecordRegistration>
     */
    public function shareRecords(): array
    {
        return $this->domain instanceof ProvidesShareRecords ? $this->domain->shareRecords() : [];
    }

    /**
     * The policies this domain registers; none without ProvidesPolicies.
     *
     * @return list<PolicyRegistration>
     */
    public function policies(): array
    {
        return $this->domain instanceof ProvidesPolicies ? $this->domain->policies() : [];
    }

    /**
     * The share gateways this domain adds, by key; none without ProvidesShareGateways.
     *
     * @return array<string, class-string<ShareGateway>>
     */
    public function shareGateways(): array
    {
        return $this->domain instanceof ProvidesShareGateways ? $this->domain->shareGateways() : [];
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
     * The holders of records this domain adds; none when it declares no ProvidesAssignees.
     *
     * @return list<AssigneeRegistration>
     */
    public function assignees(): array
    {
        return $this->domain instanceof ProvidesAssignees ? $this->domain->assignees() : [];
    }

    /**
     * Whether this domain's actors may take automatically assigned work now; none without ProvidesAssignees.
     *
     * @return list<ActivityRegistration>
     */
    public function activities(): array
    {
        return $this->domain instanceof ProvidesAssignees ? $this->domain->activities() : [];
    }

    /**
     * The command rules this domain declares for its own programs, owned by it as a module so they wait for review;
     * none without ProvidesCommandRules.
     *
     * @return list<CommandRule>
     */
    public function commandRules(): array
    {
        if (! $this->domain instanceof ProvidesCommandRules) {
            return [];
        }
        $scope = RuleScope::module($this->name, '');

        return array_map(
            fn (CommandRule $rule): CommandRule => $rule->ownedBy($scope, $rule->revision),
            $this->domain->commandRules(),
        );
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
