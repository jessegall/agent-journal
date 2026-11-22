<?php

declare(strict_types=1);

namespace App\Support;

use Spatie\TypeScriptTransformer\PhpNodes\PhpClassNode;
use Spatie\TypeScriptTransformer\PhpNodes\PhpPropertyNode;
use WeakMap;

/**
 * Whether a TypeScript transformer's source node, a class or a property read natively or from source without loading
 * it, carries an attribute, asked through the node's own API once per node and attribute. The answers are kept by
 * node, so a node no one holds any longer takes its answers with it, and they never join the class-name catalogue.
 */
final class SourceNodeAttributes
{
    private static self|null $current = null;

    /**
     * Each node's answers by the attribute class asked for.
     *
     * @var WeakMap<PhpClassNode|PhpPropertyNode, array<string, bool>>
     */
    private WeakMap $answers;

    private function __construct()
    {
        $this->answers = new WeakMap();
    }

    public static function current(): self
    {
        return self::$current ??= new self();
    }

    /**
     * Whether the node carries at least one attribute of exactly this class.
     *
     * @param  class-string  $attribute
     */
    public function carries(PhpClassNode|PhpPropertyNode $node, string $attribute): bool
    {
        $answers = $this->answers[$node] ?? [];

        if (! array_key_exists($attribute, $answers)) {
            $answers[$attribute] = $node->getAttributes($attribute) !== [];
            $this->answers[$node] = $answers;
        }

        return $answers[$attribute];
    }
}
