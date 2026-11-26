<?php

declare(strict_types=1);

use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\PendingRequest;
use Tools\ModelDocs\CastPropertyTypes;
use Tools\ModelDocs\QueryMethodRemoval;

return [

    // Filename: The default filename.

    'filename' => '_ide_helper.php',

    // Models filename: The default filename for the models helper file.

    'models_filename' => '_ide_helper_models.php',

    // PhpStorm meta filename: PhpStorm also supports the directory `.phpstorm.meta.php/` with arbitrary files in it,
    // should you need additional files for your project; e.g.
    'meta_filename' => '.phpstorm.meta.php',

    // Fluent helpers: Set to true to generate commonly used Fluent methods.

    'include_fluent' => false,

    // Write model query methods: Set to false to disable generated docs for the 'query()', 'newQuery()' and
    // 'newModelQuery()' methods.

    'write_query_methods' => true,

    // Write model where methods: set to false to leave out the dynamic where methods of a model.

    'write_model_magic_where' => false,

    // Write model external Eloquent builder methods: Set to false to disable write external Eloquent builder methods.

    'write_model_external_builder_methods' => false,

    // Write model relation count and exists properties: Set to false to disable writing of relation count and exists
    // properties to model DocBlocks.

    'write_model_relation_count_properties' => true,
    'write_model_relation_exists_properties' => false,

    // Write Eloquent model mixins: This will add the necessary DocBlock mixins to the model class contained in the
    // Laravel framework.

    'write_eloquent_model_mixins' => false,

    // Helper files to include: Include helper files.

    'include_helpers' => false,

    'helper_files' => [
        base_path().'/vendor/laravel/framework/src/Illuminate/Support/helpers.php',
        base_path().'/vendor/laravel/framework/src/Illuminate/Foundation/helpers.php',
    ],

    // Model locations to include: Define in which directories the ide-helper:models command should look for models.

    'model_locations' => [
        'app',
        'domain/*/src',
    ],

    // Models to ignore: Define which models should be ignored.

    'ignored_models' => [
        // App\MyModel::class,
    ],

    // Models hooks: Define which hook classes you want to run for models to add custom information.

    'model_hooks' => [
        CastPropertyTypes::class,
        QueryMethodRemoval::class,
    ],

    // Extra classes: these implementations are not extended, but called through __call and __callStatic.

    'extra' => [
        'Eloquent' => ['Illuminate\Database\Eloquent\Builder', 'Illuminate\Database\Query\Builder'],
        'Session' => ['Illuminate\Session\Store'],
    ],

    'magic' => [],

    // Interface implementations: These interfaces will be replaced with the implementing class.

    'interfaces' => [
        // App\MyInterface::class => App\MyImplementation::class,
    ],

    // Support for camel cased models: There are some Laravel packages (such as Eloquence) that allow for accessing
    // Eloquent model properties via camel case, instead of snake case.
    'model_camel_case_properties' => false,

    // Property casts: Cast the given "real type" to the given "type".
    'type_overrides' => [
        'integer' => 'int',
        'boolean' => 'bool',
        // Laravel's decimal cast reads a decimal column as a string.
        'numeric' => 'string',
    ],

    // Include DocBlocks from classes: so the methods and properties a class declares in its DocBlock can be
    // inspected.
    'include_class_docblocks' => false,

    // Force FQN usage: Use the fully qualified (class) name in DocBlocks, even if the class exists in the same
    // namespace or there is an import (use className) of the class.
    'force_fqn' => false,

    // Use generics syntax: Use generics syntax within DocBlocks, e.g.
    'use_generics_annotations' => true,

    // Default return types for macros: Define default return types for macros without explicit return types.
    'macro_default_return_types' => [
        Factory::class => PendingRequest::class,
    ],

    // Additional relation types: Sometimes it's needed to create custom relation types.
    'additional_relation_types' => [],

    // Additional relation return types: When using custom relation types its possible for the class name to not contain
    // the proper return type of the relation.
    'additional_relation_return_types' => [],

    // Enforce nullable Eloquent relationships on not null columns: When set to true (default), this option enforces
    // nullable Eloquent relationships.

    'enforce_nullable_relationships' => true,

    // Make soft deletable relations nullable: When set to true (default), relationships to models using SoftDeletes
    // trait will be marked as nullable.

    'soft_deletes_force_nullable' => true,

    // Run artisan commands after migrations to generate model helpers: The specified commands should run after
    // migrations are finished running.
    'post_migrate' => [
        // 'ide-helper:models --nowrite',
    ],

];
