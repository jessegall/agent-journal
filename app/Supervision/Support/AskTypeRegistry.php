<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Profiles\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Values\AskTypeKey;
use App\Registries\Support\Registry;
use App\Supervision\Contracts\AskType;
use App\Supervision\Exceptions\AskRefused;

final readonly class AskTypeRegistry
{
    /** @var Registry<AskType> */
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

    /** @return list<AskType> */
    public function all(): array
    {
        return array_values($this->types->all());
    }
}
