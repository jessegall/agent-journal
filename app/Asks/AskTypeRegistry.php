<?php

declare(strict_types=1);

namespace App\Asks;

use App\Asks\Contracts\AskType;
use App\Asks\Exceptions\AskRefused;
use App\Exceptions\SupervisorRouteInvalid;
use App\Support\Registry;
use App\Values\AskTypeKey;

final readonly class AskTypeRegistry
{
    /**
     * @var Registry<AskType>
     */
    private Registry $types;

    public function __construct()
    {
        $this->types = Registry::once(SupervisorRouteInvalid::askType(...), AskRefused::typeRepeated(...));
    }

    public function register(AskType $type): void
    {
        $this->types->put($type->key()->key, $type);
    }

    public function get(AskTypeKey $key): AskType
    {
        return $this->types->get($key->key);
    }

    /**
     * @return list<AskType>
     */
    public function all(): array
    {
        return array_values($this->types->all());
    }
}
