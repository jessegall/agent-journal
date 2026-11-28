<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\DomainBootstrapper;
use App\Contracts\Events\EngineListenerProvider;
use App\Mcp\Support\McpToolDirectory;
use App\Mcp\Tools\JournalTool;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Scripts\Contracts\ScriptKeywordProvider;
use App\Scripts\Contracts\ScriptObjectProvider;
use App\Support\Bootstrappers\MigrationsBootstrapper;
use App\Support\Bootstrappers\DraftProducersBootstrapper;
use App\Support\Bootstrappers\EngineListenersBootstrapper;
use App\Support\Bootstrappers\MorphAliasesBootstrapper;
use App\Support\Bootstrappers\ScriptDefinitionsBootstrapper;

/**
 * One domain of the application: what it owns, the domains it may use, and the steps its boot runs. Every domain loads
 * its migrations; each trait it uses adds the steps of its capability, found the Laravel way by a method named
 * bootstrappers<TraitName>; the domain adds its own one-off steps in bootstrappers().
 */
abstract class Domain
{
    /**
     * The sentence that says what the domain does, shown where domains are listed.
     */
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
     * The domain's public surface, sorted into events, contracts, values, commands and exceptions, each name written
     * out
     * one by one. Empty exports are a domain nothing outside may use; there is no wildcard.
     */
    abstract public function exports(): Exports;

    /**
     * The sources this domain offers to search, each with a local key the registry qualifies with the domain name;
     * none unless it overrides this.
     *
     * @return list<SearchSource>
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
            ? [ScriptDefinitionsBootstrapper::class]
            : [];

        $drafts = $this instanceof DraftProducerProvider ? [DraftProducersBootstrapper::class] : [];
        $engine = $this instanceof EngineListenerProvider ? [EngineListenersBootstrapper::class] : [];

        return array_values(array_unique([
            MigrationsBootstrapper::class,
            MorphAliasesBootstrapper::class,
            ...$fromTraits,
            ...$scripts,
            ...$drafts,
            ...$engine,
            ...$this->bootstrappers(),
        ]));
    }
}
