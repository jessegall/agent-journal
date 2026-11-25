<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Reflection\ReflectorFactory;
use App\Contracts\Scripts\ScriptKeywordDefinition as ScriptKeywordDefinitionContract;
use App\Contracts\Scripts\ScriptKeywordRegistration as ScriptKeywordRegistrationContract;
use App\Contracts\Scripts\ScriptStatement;
use App\Contracts\Scripts\ScriptTrigger;
use App\Enums\Profiles\KeywordCategory;
use App\Exceptions\ScriptDefinitionRefused;
use App\Values\RegisteredKeyword;
use App\Values\ScriptKeywordDefinition;
use Illuminate\Contracts\Container\Container;
use PhpOption\Option;

final readonly class ScriptKeywordRegistration implements ScriptKeywordRegistrationContract
{
    /**
     * @var Registry<RegisteredKeyword>
     */
    private Registry $keywords;

    public function __construct(private Container $container, private ReflectorFactory $reflectors)
    {
        $this->keywords = Registry::once(
            ScriptDefinitionRefused::unknown(...),
            ScriptDefinitionRefused::duplicate(...),
        );
    }

    public function registerOwned(string $owner, ScriptKeywordDefinitionContract $keyword): void
    {
        if ($owner === '' || strcasecmp($owner, 'Core') === 0) {
            throw ScriptDefinitionRefused::invalidOwner($owner);
        }

        if ($keyword instanceof ScriptKeywordDefinition && $keyword->category !== KeywordCategory::Statement) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token());
        }

        $this->store($owner, $keyword);
    }

    public function register(ScriptKeywordDefinition $keyword): void
    {
        $this->store('Core', $keyword);
    }

    private function store(string $owner, ScriptKeywordDefinitionContract $keyword): void
    {
        $token = $keyword->token();

        if (preg_match('/^[A-Z][A-Z0-9_]*$/D', $token) !== 1) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        if ($keyword instanceof ScriptKeywordDefinition && $keyword->category === KeywordCategory::Statement
            && ! $keyword->form->isStatement()) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        if ($keyword instanceof ScriptKeywordDefinition && $keyword->category === KeywordCategory::Statement) {
            $this->assertPorts($keyword);
        }

        if ($keyword instanceof ScriptKeywordDefinition && $keyword->category === KeywordCategory::Trigger) {
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

    public function statement(ScriptKeywordDefinition $keyword): ScriptStatement
    {
        if ($keyword->implementation === null
            || ! $this->reflectors->isSubclassOf($keyword->implementation, ScriptStatement::class)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }

        return $this->container->make($keyword->implementation);
    }

    /**
     * The ports a statement of this keyword leaves by; other keywords leave by none.
     *
     * @return list<string>
     */
    public function portsOf(ScriptKeywordDefinition $keyword): array
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

        if (! $definition instanceof ScriptKeywordDefinition) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        return $this->statement($definition);
    }

    public function trigger(ScriptKeywordDefinition $keyword): ScriptTrigger
    {
        if ($keyword->implementation === null
            || ! $this->reflectors->isSubclassOf($keyword->implementation, ScriptTrigger::class)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }

        return $this->container->make($keyword->implementation);
    }

    private function assertPorts(ScriptKeywordDefinition $keyword): void
    {
        $ports = $this->statement($keyword)->flow()->ports;

        if ($ports === [] || count(array_unique($ports)) !== count($ports)) {
            throw ScriptDefinitionRefused::invalidKeyword($keyword->token);
        }
    }
}
