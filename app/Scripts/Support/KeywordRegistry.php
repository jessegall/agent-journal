<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Contracts\DomainAvailability;
use App\Registries\Support\Registry;
use App\Scripts\Contracts\ScriptKeywordDefinition;
use App\Scripts\Contracts\ScriptKeywordRegistration;
use App\Scripts\Exceptions\ScriptDefinitionRefused;
use App\Scripts\Values\RegisteredKeyword;
use Illuminate\Contracts\Container\Container;

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

        $token = $keyword->token();

        if (preg_match('/^[A-Z][A-Z0-9_]*$/D', $token) !== 1) {
            throw ScriptDefinitionRefused::invalidKeyword($token);
        }

        $this->keywords->put($token, new RegisteredKeyword($keyword, $owner));
    }

    public function get(string $token): RegisteredKeyword
    {
        return $this->keywords->get($token);
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
}
