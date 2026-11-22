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

    /**
     * One row per transformed PHP type: its class, owner key, exported symbol and module, sorted by class.
     */
    public const string TYPE_OWNERS_FILE = 'generated/type-owners.json';

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

        $exports = $this->ownerExportLines($byPath);

        return [
            ...$files,
            new WriteableFile(self::TYPE_OWNERS_FILE, $this->typeOwners($transformed)),
            new WriteableFile(
                self::COMPATIBILITY_FILE,
                "// Generated; re-exports every owner's types for the pages that still import this file.\n".implode(
                    "\n",
                    $exports,
                )."\n",
            ),
        ];
    }

    /**
     * One export line per owner naming its types, leaving out a name more than one owner exports: such a name means
     * nothing unambiguous here, so a page that uses it imports it from its owner.
     *
     * @param  array<string, list<Transformed>>  $typesByPath
     * @return list<string>
     */
    private function ownerExportLines(array $typesByPath): array
    {
        $names = array_map(
            fn (array $types) => array_map(fn (Transformed $type) => (string) $type->getName(), $types),
            $typesByPath,
        );

        $owners = array_count_values(array_merge(...array_values($names)));
        $exports = [];

        foreach ($names as $path => $ownNames) {
            $unique = array_values(array_filter($ownNames, fn (string $name) => $owners[$name] === 1));
            sort($unique);
            $modulePath = preg_replace('/\/index\.ts$/', '', $path);
            $exports[] = 'export type { '.implode(', ', $unique)." } from '../../{$modulePath}';";
        }

        return $exports;
    }

    public function resolveReference(Transformed $transformed): ModuleImportResolvedReference
    {
        return new ModuleImportResolvedReference((string) $transformed->getName(), $this->pathOf($transformed));
    }

    /**
     * @param  array<Transformed>  $transformed
     */
    private function typeOwners(array $transformed): string
    {
        $rows = [];

        foreach ($transformed as $type) {
            $reference = $type->getReference();

            if (! $reference instanceof ClassStringReference) {
                continue;
            }

            $rows[$reference->classString] = [
                'class' => $reference->classString,
                'owner' => $this->owners->ownerOf($reference->classString),
                'symbol' => $type->getName(),
                'module' => $this->pathOf($type),
            ];
        }

        ksort($rows);

        return json_encode(array_values($rows), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n";
    }

    private function pathOf(Transformed $transformed): string
    {
        $reference = $transformed->getReference();

        $owner = $reference instanceof ClassStringReference ? $this->owners->ownerOf(
            $reference->classString,
        ) : 'shared';

        return "generated/types/{$owner}/index.ts";
    }
}
