<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\SearchableInvalid;
use App\Exceptions\SearchableMissing;
use App\Values\DeclaredSearchable;
use App\Values\SearchWords;

/**
 * Every searchable the domains declare, by qualified key: the lower-case owner, a dot and the local key, as in
 * tasks.task. A publication is checked whole before it replaces the catalogue, so a failed one leaves the previous
 * catalogue serving. It holds declarations only; who may search each is SearchEligibility's answer.
 */
final class SearchablesRegistry
{
    public const int QUALIFIED_KEY_BYTE_LIMIT = 64;

    private const string QUALIFIED_KEY_PATTERN = '/^[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*$/';

    /**
     * @var Registry<DeclaredSearchable>
     */
    private Registry $published;

    private function __construct()
    {
        $this->published = self::emptyRegistry();
    }

    /**
     * @param  array<string, list<Searchable>>  $declarationsByOwner
     *
     * @throws SearchableInvalid
     */
    public static function publishing(array $declarationsByOwner): self
    {
        $registry = new self;
        $registry->publish($declarationsByOwner);

        return $registry;
    }

    /**
     * Replaces the catalogue with these declarations, or throws and keeps the catalogue it had.
     *
     * @param  array<string, list<Searchable>>  $declarationsByOwner
     *
     * @throws SearchableInvalid
     */
    public function publish(array $declarationsByOwner): void
    {
        $next = self::emptyRegistry();

        foreach ($declarationsByOwner as $owner => $searchables) {
            foreach ($searchables as $searchable) {
                $declared = self::declared($owner, $searchable);

                if ($next->has($declared->qualifiedKey)) {
                    $first = $next->get($declared->qualifiedKey)->owner;

                    throw SearchableInvalid::forDuplicate($declared->qualifiedKey, $first, $owner);
                }

                $next->put($declared->qualifiedKey, $declared);
            }
        }

        $this->published = $next;
    }

    /**
     * Every published searchable in binary key order.
     *
     * @return list<DeclaredSearchable>
     */
    public function all(): array
    {
        $all = $this->published->all();
        ksort($all, SORT_STRING);

        return array_values($all);
    }

    public function has(string $qualifiedKey): bool
    {
        return $this->published->has($qualifiedKey);
    }

    /**
     * @throws SearchableMissing
     */
    public function get(string $qualifiedKey): DeclaredSearchable
    {
        return $this->published->get($qualifiedKey);
    }

    public static function isQualifiedKey(string $text): bool
    {
        return preg_match(self::QUALIFIED_KEY_PATTERN, $text) === 1;
    }

    /**
     * @throws SearchableInvalid
     */
    private static function declared(string $owner, Searchable $searchable): DeclaredSearchable
    {
        $qualifiedKey = strtolower($owner).'.'.$searchable->localKey;

        if (strlen($qualifiedKey) > self::QUALIFIED_KEY_BYTE_LIMIT || ! self::isQualifiedKey($qualifiedKey)) {
            throw SearchableInvalid::forQualifiedLength($qualifiedKey, self::QUALIFIED_KEY_BYTE_LIMIT);
        }

        if (self::isQualifiedKey(SearchWords::fold($searchable->label))) {
            throw SearchableInvalid::forQualifiedLabel($qualifiedKey, $searchable->label);
        }

        return new DeclaredSearchable($owner, $qualifiedKey, $searchable);
    }

    /**
     * @return Registry<DeclaredSearchable>
     */
    private static function emptyRegistry(): Registry
    {
        return Registry::once(SearchableMissing::forKey(...), SearchableMissing::forKey(...));
    }
}
