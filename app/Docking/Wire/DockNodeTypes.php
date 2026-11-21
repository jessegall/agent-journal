<?php

declare(strict_types=1);

namespace App\Docking\Wire;

use Spatie\TypeScriptTransformer\References\CustomReference;
use Spatie\TypeScriptTransformer\Transformed\Transformed;
use Spatie\TypeScriptTransformer\TransformedProviders\TransformedProvider;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptAlias;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptIdentifier;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptRaw;

/**
 * The TypeScript of the dock's wire, written from the part map: one node type per part, the DockNode union of them,
 * the link a card opens and the card envelope. Nobody writes these by hand.
 */
final readonly class DockNodeTypes implements TransformedProvider
{
    public function __construct(private PartMap $parts) {}

    public function provide(): array
    {
        $nodes = array_map(
            fn (PartDescriptor $descriptor) => $this->alias($descriptor->nodeName(), $descriptor->typeScript()),
            $this->parts->descriptors(),
        );
        $names = array_map(fn (PartDescriptor $descriptor) => $descriptor->nodeName(), $this->parts->descriptors());
        $union = implode(' | ', $names);
        $version = EncodedCard::VERSION;

        return [
            ...$nodes,
            $this->alias('DockNode', $union),
            $this->alias('DockLink', '{page: string; href: string}'),
            $this->alias(
                'DockCardEnvelope',
                "{version: {$version}; placementId: string; source: {type: string; id: string}; "
                .'accessibleName: string; '
                .'safeSummary: string; open: DockLink | null; root: DockNode | null}',
            ),
        ];
    }

    private function alias(string $name, string $script): Transformed
    {
        return new Transformed(
            new TypeScriptAlias(new TypeScriptIdentifier($name), new TypeScriptRaw($script)),
            new CustomReference('docking', $name),
            ['Docking'],
        );
    }
}
