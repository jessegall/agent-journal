<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Mcp\Models\RetainedPage;
use App\Models\Messages\Message;
use App\Support\DomainRegistry;
use App\Support\MorphAliases;
use Domain\Tasks\Models\TaskRun;
use Illuminate\Database\Eloquent\Relations\Relation;
use Symfony\Component\Process\Process;

/**
 * A model's link type is its morph alias, worked out from its namespace and never written by hand: the application
 * enforces the map MorphAliases builds from the core and domain model folders (user messages 22106 to 22116).
 */
final class MorphAliasesTest extends TestCase
{
    /** What naming a core model's link type by hand looks like: a constant or a registration in a provider. */
    private const string HAND_WRITTEN = 'const string LINK_TYPE|\$links->register\(|Relation::morphMap\(\[';

    public function test_an_alias_names_the_place_of_its_model(): void
    {
        $this->assertSame('core.messages.message', Message::linkType());
        $this->assertSame('core.mcp.retained-page', new RetainedPage()->getMorphClass());
        $this->assertSame('tasks.task-run', new TaskRun()->getMorphClass());
    }

    public function test_every_model_of_the_model_folders_has_its_alias(): void
    {
        $models = [...MorphAliases::core()];

        foreach ($this->app->make(DomainRegistry::class)->all() as $domain) {
            $models = [...$models, ...MorphAliases::ofDomain($domain)];
        }

        $missing = [];

        foreach ($models as $alias => $class) {
            if (Relation::getMorphedModel($alias) !== $class) {
                $missing[] = "{$class} is not in the morph map as {$alias}";
            }
        }

        $this->assertNotEmpty($models);
        $this->assertSame([], $missing);
    }

    public function test_no_core_model_names_its_link_type_by_hand(): void
    {
        $search = new Process(['grep', '-rnE', self::HAND_WRITTEN, 'app', 'domain'], base_path());
        $search->run();

        $this->assertSame('', trim($search->getOutput()), 'Let MorphAliases give the link type: ');
    }
}
