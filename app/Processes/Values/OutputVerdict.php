<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * Whether a command line keeps the full output of every check and build part (doc 21 revision 6, section 54): allowed,
 * or refused as output_hidden with each hiding operator named.
 */
final readonly class OutputVerdict
{
    public const string CODE = 'output_hidden';

    /**
     * @param  list<HiddenOutput>  $hidden
     */
    public function __construct(public array $hidden) {}

    public function isAllowed(): bool
    {
        return $this->hidden === [];
    }

    /**
     * @return list<string>
     */
    public function reasons(): array
    {
        return array_map(fn (HiddenOutput $hidden) => $hidden->reason(), $this->hidden);
    }
}
