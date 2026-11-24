<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Events\EngineListenerProvider;
use App\Contracts\Navigation\DraftProducerProvider;
use App\Contracts\Scripts\ScriptKeywordProvider;
use App\Contracts\Scripts\ScriptObjectProvider;
use App\Mcp\Support\McpToolDirectory;
use App\Mcp\Tools\JournalTool;
use App\Support\Bootstrappers\LoadMigrations;
use App\Support\Bootstrappers\RegisterDraftProducers;
use App\Support\Bootstrappers\RegisterEngineListeners;
use App\Support\Bootstrappers\RegisterScriptDefinitions;

/**
 * One domain of the application: what it owns, the domains it may use, and the steps its boot runs. Every domain loads
 * its migrations; each trait it uses adds the steps of its capability, found the Laravel way by a method named
 * bootstrappers<TraitName>; the domain adds its own one-off steps in bootstrappers().
 */
abstract class Domain
{
    abstract public function description(): string;

    /**
     * The steps this domain adds itself, after the ones its traits bring; none unless it overrides this.
     *
     * @return list<class-string<DomainBootstrapper>>
     */
    public function bootstrappers(): array
    {
        return [];
    }

    /**
     * @return list<class-string<Domain>>
     */
    abstract public function requires(): array;

    /**
     * Whether the owner may switch this domain off; a domain the journal cannot run without answers false.
     */
    public function canDisable(): bool
    {
        return true;
    }

    /**
     * The domain's public surface, sorted into events, contracts, values, commands and exceptions, each name written
     * out
     * one by one. Empty exports are a domain nothing outside may use; there is no wildcard.
     */
    abstract public function exports(): Exports;

    /**
     * The sources this domain offers to search, each with a local key the registry qualifies with the domain name;
     * none unless it overrides this.
     *
     * @return list<Searchable>
     */
    public function searchables(): array
    {
        return [];
    }

    /**
     * @return list<class-string<JournalTool>>
     */
    public function mcpTools(): array
    {
        return McpToolDirectory::classesIn($this->mcpRoot('Tools'));
    }

    /**
     * The folder this package's MCP classes of one role, Tools or Resources, are read from.
     */
    protected function mcpRoot(string $role): string
    {
        $domainFile = Reflector::of($this)->fileName()->getOrElse('');

        return McpToolDirectory::rootOf(dirname($domainFile), $role);
    }

    /**
     * Every step the domain's boot runs, in order: its migrations, its traits' steps, then its own.
     *
     * @return list<class-string<DomainBootstrapper>>
     */
    final public function bootSteps(): array
    {
        $traits = class_uses_recursive(static::class);
        $fromTraits = [];

        foreach ($traits as $trait) {
            $method = 'bootstrappers'.class_basename($trait);

            if (Reflector::of($this)->hasMethod($method)) {
                array_push($fromTraits, ...$this->{$method}());
            }
        }

        $scripts = $this instanceof ScriptObjectProvider || $this instanceof ScriptKeywordProvider
            ? [RegisterScriptDefinitions::class]
            : [];

        $drafts = $this instanceof DraftProducerProvider ? [RegisterDraftProducers::class] : [];
        $engine = $this instanceof EngineListenerProvider ? [RegisterEngineListeners::class] : [];

        return array_values(array_unique([
            LoadMigrations::class,
            ...$fromTraits,
            ...$scripts,
            ...$drafts,
            ...$engine,
            ...$this->bootstrappers(),
        ]));
    }
}
