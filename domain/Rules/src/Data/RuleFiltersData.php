<?php

declare(strict_types=1);

namespace Domain\Rules\Data;

use Domain\Rules\Values\RuleFilters;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The accepted filters of the rules page as the browser keeps them in the query string: search words, page and the
 * selected rule's id as a ULID.
 */
#[TypeScript]
final class RuleFiltersData extends Data
{
    public function __construct(
        #[MapName('q')]
        public readonly string $search = '',
        public readonly int $page = 1,
        #[Ulid]
        public readonly string|Optional $rule = new Optional(),
    ) {}

    /**
     * The search and page may be left out, and an empty search arrives as null after Laravel's empty-string conversion;
     * both then take their defaults.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }

    /**
     * The same filters on the page the domain settled on, which may differ from the one asked for.
     */
    public function onPage(int $page): self
    {
        return self::from([...$this->toArray(), 'page' => $page]);
    }

    public function toDomain(): RuleFilters
    {
        return new RuleFilters(
            $this->search,
            $this->page,
            $this->rule instanceof Optional ? null : (string) $this->rule,
        );
    }
}
