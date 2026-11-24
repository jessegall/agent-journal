<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use App\Values\KeywordDefinition;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One keyword of the script language as an editor offers it: its token, kind, form, documentation, the ports a
 * statement leaves by, and whether its owning domain is available now.
 */
#[TypeScript]
final class ScriptKeywordData extends Data
{
    /**
     * @param  list<string>  $ports
     */
    public function __construct(
        public readonly string $token,
        public readonly string $category,
        public readonly string $form,
        public readonly string $documentation,
        public readonly array $ports,
        public readonly bool $isAvailable,
    ) {}

    /**
     * @param  list<string>  $ports
     */
    public static function fromDefinition(KeywordDefinition $definition, array $ports, bool $available): self
    {
        return new self(
            $definition->token,
            $definition->category->value,
            $definition->form->value,
            $definition->documentation,
            $ports,
            $available,
        );
    }
}
