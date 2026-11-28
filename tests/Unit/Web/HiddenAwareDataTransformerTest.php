<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Support\Types\HiddenAwareDataTransformer;
use Spatie\TypeScriptTransformer\Actions\LoadPhpClassNodeAction;
use Spatie\TypeScriptTransformer\Data\TransformationContext;
use Spatie\TypeScriptTransformer\PhpNodes\PhpClassNode;
use Spatie\TypeScriptTransformer\Transformed\Transformed;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptAlias;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptArray;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptObject;
use Spatie\TypeScriptTransformer\TypeScriptNodes\TypeScriptReference;
use Tests\Fixtures\Web\Types\BookData;
use Tests\Fixtures\Web\Types\Shelves\ShelfData;
use Tests\TestCase;

final class HiddenAwareDataTransformerTest extends TestCase
{
    public function test_a_traits_imported_collection_item_becomes_a_typescript_reference(): void
    {
        $source = new LoadPhpClassNodeAction()->execute(base_path('tests/Fixtures/Web/Types/Shelves/ShelfData.php'));
        $this->assertInstanceOf(PhpClassNode::class, $source);
        $transformer = new HiddenAwareDataTransformer();

        foreach ([$source, PhpClassNode::fromClassString(ShelfData::class)] as $class) {
            $transformed = $transformer->transform($class, TransformationContext::createFromPhpClass($class));
            $this->assertInstanceOf(Transformed::class, $transformed);
            $alias = $transformed->getNode();
            $this->assertInstanceOf(TypeScriptAlias::class, $alias);
            $this->assertInstanceOf(TypeScriptObject::class, $alias->type);
            $this->assertCount(1, $alias->type->properties);
            $this->assertEquals(
                new TypeScriptArray([TypeScriptReference::referencingPhpClass(BookData::class)]),
                $alias->type->properties[0]->type,
            );
        }
    }
}
