<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ReferenceRecognizer;
use App\Contracts\SearchAccess;
use App\Contracts\SearchProvider;
use App\Exceptions\SearchableInvalid;
use Closure;

/**
 * One source a domain declares for search: its local key, its label, the access policy that guards it, the
 * provider that searches it and, optionally, the recognizer of its complete references. It holds names only: the
 * provider is built when a search reaches it, and no actor is kept.
 */
final readonly class Searchable
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
     * @param  class-string<SearchProvider>|Closure  $provider  a closure takes a SearchQuery and returns a SearchBatch
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

        self::assertImplements($localKey, $accessClass, SearchAccess::class);

        if (is_string($provider)) {
            self::assertImplements($localKey, $provider, SearchProvider::class);
        }

        if ($recognizerClass !== null) {
            self::assertImplements($localKey, $recognizerClass, ReferenceRecognizer::class);
        }

        return new self($localKey, trim($label), $accessClass, $provider, $recognizerClass);
    }

    public function hasRecognizer(): bool
    {
        return $this->recognizerClass !== null;
    }

    /**
     * @param  class-string  $contract
     */
    private static function assertImplements(string $localKey, string $class, string $contract): void
    {
        if (! is_a($class, $contract, true)) {
            throw SearchableInvalid::forClass($localKey, $class, $contract);
        }
    }
}
