<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Access\Contracts\VisibilityCheck;
use App\Support\Reflector;
use App\Web\Attributes\Paged;
use App\Web\Attributes\RecordScoped;
use App\Web\Creation\Exceptions\InvalidSurfacePolicy;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Data;

final readonly class SurfacePolicy
{
    /**
     * @param class-string<Data> $type
     * @param array<string, SurfacePropPolicy> $properties
     * @param list<class-string<VisibilityCheck>> $checks
     * @param array<string, positive-int> $bounds
     * @param array<string, string> $appendKeys
     */
    public function __construct(
        public string $type,
        public SurfacePropPolicy $prop,
        public array $properties,
        public array $checks,
        public RecordScoped|null $recordScope,
        public Paged|null $paging,
        private array $bounds,
        public bool $isCopyScoped,
        public array $appendKeys,
    ) {}

    public function limitFor(string $field): int
    {
        return $this->bounds[$field] ?? throw InvalidSurfacePolicy::at(
            $this->type.'::'.$field,
            'The collection has no declared bound.',
        );
    }

    public function pageNumber(SurfaceContext $context): int
    {
        $paging = $this->paging ?? throw InvalidSurfacePolicy::at($this->type, 'The read has no paging policy.');
        $value = $context->queryValue($paging->parameter);

        if ($value === null) {
            return 1;
        }

        if ((! is_int($value) && ! is_string($value))
            || filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) === false) {
            throw ValidationException::withMessages([$paging->parameter => 'Enter a positive page number.']);
        }

        return (int) $value;
    }

    public function pageSize(): int
    {
        return $this->paging?->size ?? throw InvalidSurfacePolicy::at($this->type, 'The read has no paging policy.');
    }

    public function assertRows(Data $product): void
    {
        $class = Reflector::of($product);

        foreach ($this->bounds as $field => $limit) {
            $rows = $class->property($field)->readFrom($product);

            if (! is_countable($rows) || count($rows) > $limit) {
                throw InvalidSurfacePolicy::at($this->type.'::'.$field, "The collection permits at most {$limit} rows.");
            }
        }

        foreach ($this->appendKeys as $field => $key) {
            $rows = $class->property($field)->readFrom($product);

            if (! is_iterable($rows)) {
                throw InvalidSurfacePolicy::at($this->type.'::'.$field, 'An appendable collection must be iterable.');
            }

            $keys = [];

            foreach ($rows as $row) {
                $identity = is_object($row) ? Reflector::of($row)->property($key)->readFrom($row) : null;

                if (! is_string($identity) || $identity === '' || isset($keys[$identity])) {
                    throw InvalidSurfacePolicy::at($this->type.'::'.$field, 'Each row must have a unique identity.');
                }

                $keys[$identity] = true;
            }
        }
    }
}
