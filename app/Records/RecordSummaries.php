<?php

declare(strict_types=1);

namespace App\Records;

use App\Records\Contracts\RecordSummaries as RecordSummariesContract;
use App\Records\Contracts\SummaryProvider;
use App\Records\Exceptions\RecordProviderInvalid;
use App\Reflection\Contracts\ReflectorFactory;
use App\Support\Registry;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;

/**
 * The summary provider of every record type whose owner registered one, made from the container when asked.
 */
#[Singleton]
final class RecordSummaries implements RecordSummariesContract
{
    /**
     * @var Registry<class-string<SummaryProvider>>
     */
    private readonly Registry $providerOfType;

    public function __construct(private readonly Container $container, private readonly ReflectorFactory $reflectors)
    {
        $this->providerOfType = Registry::once(
            RecordProviderInvalid::unknown(...),
            RecordProviderInvalid::repeated(...),
        );
    }

    public function register(string $type, string $provider): void
    {
        if (! $this->reflectors->isSubclassOf($provider, SummaryProvider::class)) {
            throw RecordProviderInvalid::notAProvider($type, $provider);
        }

        $this->providerOfType->put($type, $provider);
    }

    public function types(): array
    {
        return $this->providerOfType->keys();
    }

    public function covers(string $type): bool
    {
        return $this->providerOfType->has($type);
    }

    public function providerOf(string $type): SummaryProvider
    {
        return $this->container->make($this->providerOfType->get($type));
    }
}
