<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Contracts\DomainAvailability;
use App\Contracts\WorkspaceReader;
use App\Exceptions\ScriptDefinitionRefused;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Bootstrappers\RegisterScriptDefinitions;
use App\Support\DomainEntry;
use App\Support\KeywordRegistry;
use App\Support\ObjectRegistry;
use App\Support\Objects\WorkspaceObject;
use App\Values\ProfileKey;
use App\Values\ProfileRevisionReference;
use App\Values\ScriptContext;
use App\Values\WorkReference;
use App\Values\WorkspaceReadReference;
use Tests\Fixtures\Scripts\ExampleScriptObject;
use Tests\Fixtures\Scripts\InvalidScriptObject;
use Tests\Fixtures\Scripts\ScriptFixtureDomain;
use Tests\TestCase;

final class ScriptDefinitionsTest extends TestCase
{
    public function test_workspace_members_are_reflected_without_resolving_the_workspace_reader(): void
    {
        $objects = $this->app->make(ObjectRegistry::class);
        $workspace = $objects->get('workspace');
        $names = array_keys($workspace->members);
        sort($names);

        $this->assertSame(['available', 'clean', 'dirty'], $names);
        $this->assertSame('workspace.status', $workspace->members['dirty']->read->key);
        $this->assertFalse($this->app->resolved(WorkspaceReader::class));
        $this->assertThrows(fn () => $objects->register(WorkspaceObject::class), ScriptDefinitionRefused::class);
        $this->assertThrows(fn () => $objects->register(InvalidScriptObject::class), ScriptDefinitionRefused::class);
    }

    public function test_disabled_domains_keep_their_definition_metadata_without_allowing_evaluation(): void
    {
        $domain = DomainEntry::fromClass(ScriptFixtureDomain::class);
        $this->assertContains(RegisterScriptDefinitions::class, $domain->domain->bootSteps());
        $this->app->make(RegisterScriptDefinitions::class)($domain);
        $this->mock(DomainAvailability::class)->shouldReceive('isEnabled')->with($domain->name)->andReturn(false);
        $objects = $this->app->make(ObjectRegistry::class);
        $keywords = $this->app->make(KeywordRegistry::class);

        $this->assertSame($domain->name, $objects->get('example')->owner);
        $this->assertFalse($objects->isAvailable($objects->get('example')));
        $this->assertFalse($keywords->isAvailable($keywords->get('NOTE')));
        $this->assertThrows(
            fn () => $objects->make('example', $this->context('selected')),
            ScriptDefinitionRefused::class,
        );
        $this->assertThrows(
            fn () => $objects->registerOwned('Core', ExampleScriptObject::class),
            ScriptDefinitionRefused::class,
        );
    }

    public function test_each_evaluation_constructs_a_fresh_object_with_its_context(): void
    {
        $objects = $this->app->make(ObjectRegistry::class);
        $objects->register(ExampleScriptObject::class);
        $first = $objects->make('example', $this->context('selected'));
        $second = $objects->make('example', $this->context('opened'));

        $this->assertInstanceOf(ExampleScriptObject::class, $first);
        $this->assertInstanceOf(ExampleScriptObject::class, $second);
        $this->assertNotSame($first, $second);
        $this->assertTrue($first->selected);
        $this->assertFalse($second->selected);
    }

    private function context(string $trigger): ScriptContext
    {
        return new ScriptContext(
            ActorIdentity::of(ActorContext::forUser('owner')),
            WorkReference::free('ask'),
            new ProfileRevisionReference(ProfileKey::from('draft-test'), 1),
            $trigger,
            new WorkspaceReadReference('workspace-read'),
        );
    }
}
