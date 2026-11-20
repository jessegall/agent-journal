<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Contracts\DomainAvailability;
use App\Registries\Support\Registry;
use App\Scripts\Contracts\ScriptKeywordDefinition;
use App\Scripts\Contracts\ScriptKeywordRegistration;
use App\Scripts\Contracts\ScriptStatement;
use App\Scripts\Contracts\ScriptTrigger;
use App\Scripts\Enums\KeywordCategory;
use App\Scripts\Exceptions\ScriptDefinitionRefused;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\RegisteredKeyword;
use Illuminate\Contracts\Container\Container;
use PhpOption\Option;

final readonly class KeywordRegistry implements ScriptKeywordRegistration
{
    /**
     * @var Registry<RegisteredKeyword>
     */
    private Registry $keywords;

    public function __construct(private Container $container)
    {
        $this->keywords = Registry::once(
            ScriptDefinitionRefused::unknown(...),
            ScriptDefinitionRefused::duplicate(...),
        );
    }

    public function registerOwned(string $owner, ScriptKeywordDefinition $keyword): void
    {
        if ($owner === '' || strcasecmp($owner, 'Core') === 0) {
            throw ScriptDefinitionRefused::invalidOwner($owner);
        }

        if ($keyword instanceof KeywordDefinition && $keyword->category !== KeywordCategory::Statement) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token());
        }

        $this->store($owner, $keyword);
    }

    public function register(KeywordDefinition $keyword): void
    {
        $this->store('Core', $keyword);
    }

    private function store(string $owner, ScriptKeywordDefinition $keyword): void
    {
        $token = $keyword->token();

        if (preg_match('/^[A-Z][A-Z0-9_]*$/D', $token) !== 1) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        if ($keyword instanceof KeywordDefinition && $keyword->category === KeywordCategory::Statement
            && ! $keyword->form->isStatement()) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        if ($keyword instanceof KeywordDefinition && $keyword->category === KeywordCategory::Statement) {
            $this->assertPorts($keyword);
        }

        if ($keyword instanceof KeywordDefinition && $keyword->category === KeywordCategory::Trigger) {
            $this->trigger($keyword);
        }

        $this->keywords->put($token, new RegisteredKeyword($keyword, $owner));
    }

    public function get(string $token): RegisteredKeyword
    {
        return $this->keywords->get($token);
    }

    /**
     * @return Option<RegisteredKeyword>
     */
    public function find(string $token): Option
    {
        return $this->keywords->find($token);
    }

    /**
     * @return list<RegisteredKeyword>
     */
    public function all(): array
    {
        return array_values($this->keywords->all());
    }

    public function isAvailable(RegisteredKeyword $keyword): bool
    {
        return $this->container->make(DomainAvailability::class)->isEnabled($keyword->owner);
    }

    public function statement(KeywordDefinition $keyword): ScriptStatement
    {
        if ($keyword->implementation === null || ! is_subclass_of($keyword->implementation, ScriptStatement::class)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }

        return $this->container->make($keyword->implementation);
    }

    /**
     * The ports a statement of this keyword leaves by; other keywords leave by none.
     *
     * @return list<string>
     */
    public function portsOf(KeywordDefinition $keyword): array
    {
        if ($keyword->category !== KeywordCategory::Statement) {
            return [];
        }

        return $this->statement($keyword)->flow()->ports;
    }

    /**
     * The statement that runs an instruction of this keyword.
     */
    public function statementFor(string $token): ScriptStatement
    {
        $definition = $this->get($token)->definition;

        if (! $definition instanceof KeywordDefinition) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        return $this->statement($definition);
    }

    public function trigger(KeywordDefinition $keyword): ScriptTrigger
    {
        if ($keyword->implementation === null || ! is_subclass_of($keyword->implementation, ScriptTrigger::class)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }

        return $this->container->make($keyword->implementation);
    }

    private function assertPorts(KeywordDefinition $keyword): void
    {
        $ports = $this->statement($keyword)->flow()->ports;

        if ($ports === [] || count(array_unique($ports)) !== count($ports)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }
    }
}
