<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use Illuminate\Support\Str;

/**
 * Runs a command on the bus under a request key of its own, or the given one to send the same request again, and
 * forgets the key afterwards, as the web's middleware does after each request.
 */
trait RunsKeyedCommands
{
    protected function runOnBus(object $command, string|null $key = null): mixed
    {
        $requestKey = $this->app->make(RequestKey::class);
        $requestKey->set($key ?? (string) Str::ulid());

        try {
            return $this->app->make(CommandBus::class)->run($command);
        } finally {
            $requestKey->forget();
        }
    }
}
