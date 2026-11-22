<?php

declare(strict_types=1);

namespace App\Declarations;

use Spatie\LaravelData\Data;

/**
 * A declaration file as its text decodes: its list of declarations, each checked field by field before it is read
 * as a RuleDeclaration.
 */
final class DeclarationFileText extends Data
{
    /**
     * @param  list<array<string, mixed>>  $declarations
     */
    public function __construct(public readonly array $declarations) {}
}
