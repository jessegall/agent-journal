<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReadGrant;
use App\Contracts\DomainAvailability;
use App\Contracts\SearchAccess;
use App\Exceptions\SearchableMissing;
use App\Exceptions\SearchValueInvalid;
use App\Values\DeclaredSearchable;
use App\Values\DiscoveryPage;
use App\Values\ScopeResolution;
use App\Values\SearchReader;
use Illuminate\Contracts\Container\Container;

/**
 * Which published sources one reader may search now: its owner and every domain the owner requires are available,
 * and its access policy lets the reader in. Discovery, scope resolution, dispatch, resume and open all ask here,
 * so a source the reader may not search reads exactly as one that does not exist.
 */
final readonly class SearchEligibility
{
    public function __construct(
        private SearchablesRegistry $searchables,
        private DomainAvailability $availability,
        private ReadGrant $reads,
        private Container $container,
    ) {}

    /**
     * Every source the reader may search, in binary key order.
     *
     * @return list<DeclaredSearchable>
     */
    public function eligible(SearchReader $reader): array
    {
        return array_values(array_filter(
            $this->searchables->all(),
            fn (DeclaredSearchable $source): bool => $this->admits($reader, $source),
        ));
    }

    public function admits(SearchReader $reader, DeclaredSearchable $source): bool
    {
        if (! $this->availability->isEnabled($source->owner)) {
            return false;
        }

        $access = $this->access($source);

        if ($reader->isAgent()) {
            return $this->reads->allows($access->agentRead());
        }

        return $access->canUserSearch($reader->actor);
    }

    /**
     * The eligible source with this qualified key; an ineligible one is missing just as an absent one is.
     *
     * @throws SearchableMissing
     */
    public function source(SearchReader $reader, string $qualifiedKey): DeclaredSearchable
    {
        if (! $this->searchables->has($qualifiedKey)) {
            throw SearchableMissing::forKey($qualifiedKey);
        }

        $source = $this->searchables->get($qualifiedKey);

        if (! $this->admits($reader, $source)) {
            throw SearchableMissing::forKey($qualifiedKey);
        }

        return $source;
    }

    /**
     * The access policy of one source, built by the container when a search reaches it.
     */
    public function access(DeclaredSearchable $source): SearchAccess
    {
        return $this->container->make($source->searchable->accessClass);
    }

    /**
     * Resolves what the caller typed as a scope: an exact key first, else the whole trimmed label in folded form.
     */
    public function resolve(SearchReader $reader, string $chosen): ScopeResolution
    {
        $eligible = $this->eligible($reader);

        foreach ($eligible as $source) {
            if ($source->qualifiedKey === $chosen) {
                return ScopeResolution::resolved($source);
            }
        }

        $labelled = array_values(array_filter($eligible, fn (DeclaredSearchable $source) => $source->hasLabel($chosen)));

        if (count($labelled) === 1) {
            return ScopeResolution::resolved($labelled[0]);
        }

        if ($labelled !== []) {
            return ScopeResolution::ambiguous($labelled);
        }

        return ScopeResolution::unknown($eligible);
    }

    /**
     * One page of the eligible sources whose key or label starts with the prefix, after the given key.
     *
     * @throws SearchValueInvalid
     */
    public function discover(
        SearchReader $reader,
        string $prefix,
        int $size = DiscoveryPage::DEFAULT_SIZE,
        string|null $after = null,
    ): DiscoveryPage
    {
        if ($size < 1 || $size > DiscoveryPage::SIZE_LIMIT) {
            throw SearchValueInvalid::outOfRange('discovery page size', 1, DiscoveryPage::SIZE_LIMIT);
        }

        $matching = array_values(array_filter(
            $this->eligible($reader),
            fn (DeclaredSearchable $source): bool => ($after === null || strcmp($source->qualifiedKey, $after) > 0)
                && $source->startsWith($prefix),
        ));

        $page = array_slice($matching, 0, $size);
        $nextAfter = count($matching) > $size ? $page[$size - 1]->qualifiedKey : null;

        return new DiscoveryPage($prefix, $page, $nextAfter);
    }
}
