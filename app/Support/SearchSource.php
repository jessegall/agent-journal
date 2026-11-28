<?php

declare(strict_types=1);

namespace App\Support;

use App\Records\Contracts\ReferenceRecognizer;
use App\Search\ClosureSearchProvider;
use App\Search\Contracts\SearchAccess;
use App\Search\Contracts\SearchProvider;
use App\Search\Exceptions\SearchableInvalid;
use Closure;
use Illuminate\Contracts\Container\Container;

/**
 * One source a domain declares for search: its local key, its label, the access policy that guards it, the
 * provider that searches it and, optionally, the recognizer of its complete references. It holds names only: the
 * provider is built when a search reaches it, and no actor is kept.
 */
final readonly class SearchSource
{
    public const int KEY_BYTE_LIMIT = 48;

    private const string KEY_PATTERN = '/^[a-z][a-z0-9_-]*$/';

    /**
     * @param  class-string<SearchAccess>  $accessClass
     * @param  class-string<SearchProvider>|Closure  $provider
     * @param  class-string<ReferenceRecognizer>|null  $recognizerClass
     */
    private function __construct(
        public string $localKey,
        public string $label,
        public string $accessClass,
        public string|Closure $provider,
        public string|null $recognizerClass,
    ) {}

    /**
     * @param  class-string<SearchAccess>  $accessClass
     * @param  class-string<SearchProvider>|Closure  $provider  a closure takes a SearchQuery or RefreshCandidates and
     *                                                          returns a SearchBatch
     * @param  class-string<ReferenceRecognizer>|null  $recognizerClass
     *
     * @throws SearchableInvalid
     */
    public static function make(
        string $localKey,
        string $label,
        string $accessClass,
        string|Closure $provider,
        string|null $recognizerClass = null,
    ): self {
        if (strlen($localKey) > self::KEY_BYTE_LIMIT || preg_match(self::KEY_PATTERN, $localKey) !== 1) {
            throw SearchableInvalid::forKey($localKey);
        }

        if (trim($label) === '') {
            throw SearchableInvalid::forLabel($localKey);
        }

        return new self($localKey, trim($label), $accessClass, $provider, $recognizerClass);
    }

    public function hasRecognizer(): bool
    {
        return $this->recognizerClass !== null;
    }

    /**
     * The provider, built when a search reaches this source: the container makes a class, a closure is wrapped.
     */
    public function providerFrom(Container $container): SearchProvider
    {
        if ($this->provider instanceof Closure) {
            return new ClosureSearchProvider($this->provider);
        }

        return $container->make($this->provider);
    }

    /**
     * The recognizer of complete references, or null when the source declares none.
     */
    public function recognizerFrom(Container $container): ReferenceRecognizer|null
    {
        if ($this->recognizerClass === null) {
            return null;
        }

        return $container->make($this->recognizerClass);
    }
}
