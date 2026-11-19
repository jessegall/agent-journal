<?php

declare(strict_types=1);

namespace App\Records\Support;

use App\Links\Exceptions\UnknownLinkType;
use App\Links\Models\Link;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordProvider;
use App\Records\Contracts\RecordProviderRegistration;
use App\Records\Contracts\RecordResolver;
use App\Records\Data\RecordCard;
use App\Records\Exceptions\RecordProviderInvalid;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Container\Container;
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
     * @var array<string, class-string<RecordProvider>>
     */
    private array $providerOfType = [];

    public function __construct(private readonly Container $container) {}

    public function register(string $type, string $providerClass): void
    {
        RecordIdentity::checkType($type);

        if (array_key_exists($type, $this->providerOfType)) {
            throw RecordProviderInvalid::repeated($type);
        }

        if (! is_subclass_of($providerClass, RecordProvider::class)) {
            throw RecordProviderInvalid::notAProvider($type, $providerClass);
        }

        $this->providerOfType[$type] = $providerClass;
    }

    public function identify(RecordReference $reference): RecordIdentity
    {
        foreach (array_keys($this->providerOfType) as $type) {
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

        foreach ($this->byType($records) as $type => $ofType) {
            $cards = [...$cards, ...$this->providerOf($type)->visibleCards($ofType)];
        }

        return $cards;
    }

    public function linkedCards(Model $record): array
    {
        $links = Link::query()->touching($record)->readLimit(RecordProviders::MOST_LINKS_SHOWN)->get();
        $linked = [];

        foreach ($links as $link) {
            [$type, $id] = $link->otherSideFrom($record);

            if (array_key_exists($type, $this->providerOfType)) {
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
        $providerClass = $this->providerOfType[$type] ?? throw UnknownLinkType::forAlias($type);

        return $this->container->make($providerClass);
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return array<string, list<RecordIdentity>>
     */
    private function byType(array $records): array
    {
        $grouped = [];

        foreach ($records as $record) {
            $grouped[$record->type][] = $record;
        }

        return $grouped;
    }
}
