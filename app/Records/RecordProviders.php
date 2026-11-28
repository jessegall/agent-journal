<?php

declare(strict_types=1);

namespace App\Records;

use App\Data\Pages\RecordCard;
use App\Exceptions\UnknownLinkType;
use App\Models\Records\Link;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordProviderRegistration;
use App\Records\Contracts\RecordResolver;
use App\Records\Exceptions\RecordProviderInvalid;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Support\Reflector;
use App\Support\Registry;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Model;

/**
 * The record providers every domain registered by link alias, and the reader that asks them. An alias nobody
 * registered is refused by name before any class is resolved.
 */
#[Singleton]
final class RecordProviders implements RecordProviderRegistration, RecordResolver
{
    public const int MOST_LINKS_SHOWN = 200;

    /**
     * @var Registry<class-string<RecordProvider>>
     */
    private readonly Registry $providerOfType;

    public function __construct()
    {
        $this->providerOfType = Registry::once(UnknownLinkType::forAlias(...), RecordProviderInvalid::repeated(...));
    }

    public function register(string $type, string $class): void
    {
        RecordIdentity::assertKnownType($type);

        if (! Reflector::factory()->isSubclassOf($class, RecordProvider::class)) {
            throw RecordProviderInvalid::notAProvider($type, $class);
        }

        $this->providerOfType->put($type, $class);
    }

    public function types(): array
    {
        return $this->providerOfType->keys();
    }

    public function identify(RecordReference $reference): RecordIdentity
    {
        foreach ($this->providerOfType->keys() as $type) {
            $provider = $this->providerOf($type);

            if ($provider->referenceWord() === $reference->type) {
                return $provider->identityOf($reference->number);
            }
        }

        throw UnknownLinkType::forAlias($reference->type);
    }

    public function card(RecordIdentity $record): RecordCard
    {
        return $this->providerOf($record->type)->card($record);
    }

    public function visibleCards(array $records): array
    {
        $cards = [];

        foreach (RecordIdentity::groupedByType($records) as $type => $ofType) {
            $cards = [...$cards, ...$this->providerOf($type)->visibleCards($ofType)];
        }

        return $cards;
    }

    public function linkedCards(Model $record): array
    {
        $links = Link::query()->touching($record)->limit(RecordProviders::MOST_LINKS_SHOWN)->get();
        $linked = [];

        foreach ($links as $link) {
            [$type, $id] = $link->otherSideFrom($record);

            if ($this->providerOfType->has($type)) {
                $linked[] = new RecordIdentity($type, $id);
            }
        }

        return $this->visibleCards($linked);
    }

    public function requireReadable(RecordIdentity $record): Model
    {
        return $this->providerOf($record->type)->requireReadable($record);
    }

    public function requireWritable(RecordIdentity $record): Model
    {
        return $this->providerOf($record->type)->requireWritable($record);
    }

    /**
     * @throws UnknownLinkType
     */
    private function providerOf(string $type): RecordProvider
    {
        return Container::getInstance()->make($this->providerOfType->get($type));
    }
}
