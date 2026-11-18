<?php

declare(strict_types=1);

namespace App\Web\Types;

use Spatie\TypeScriptTransformer\Collections\TransformedCollection;
use Spatie\TypeScriptTransformer\Data\ModuleImportResolvedReference;
use Spatie\TypeScriptTransformer\Data\WriteableFile;
use Spatie\TypeScriptTransformer\References\ClassStringReference;
use Spatie\TypeScriptTransformer\Transformed\Transformed;
use Spatie\TypeScriptTransformer\Writers\FlatModuleWriter;
use Spatie\TypeScriptTransformer\Writers\Writer;

/**
 * Writes each owner's types to generated/types/<owner>/index.ts, importing across owners where a type names another
 * owner's, and keeps types/generated/index.ts as a file that re-exports them all for the pages that still import it.
 */
final readonly class DomainTypeWriter implements Writer
{
    public const string COMPATIBILITY_FILE = 'types/generated/index.ts';

    public function __construct(private TypeOwners $owners) {}

    public function output(array $transformed, TransformedCollection $transformedCollection): array
    {
        $byPath = [];

        foreach ($transformed as $type) {
            $byPath[$this->pathOf($type)][] = $type;
        }

        ksort($byPath);
        $files = [];

        foreach ($byPath as $path => $types) {
            array_push($files, ...new FlatModuleWriter($path)->output($types, $transformedCollection));
        }

        $exports = array_map(fn (string $path) => "export * from '../../".preg_replace('/\/index\.ts$/', '', $path)."';", array_keys($byPath));

        return [...$files, new WriteableFile(self::COMPATIBILITY_FILE, "// Generated; re-exports every owner's types for the pages that still import this file.\n".implode("\n", $exports)."\n")];
    }

    public function resolveReference(Transformed $transformed): ModuleImportResolvedReference
    {
        return new ModuleImportResolvedReference((string) $transformed->getName(), $this->pathOf($transformed));
    }

    private function pathOf(Transformed $transformed): string
    {
        $reference = $transformed->getReference();
        $owner = $reference instanceof ClassStringReference ? $this->owners->ownerOf($reference->classString) : 'shared';

        return "generated/types/{$owner}/index.ts";
    }
}
