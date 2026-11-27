<?php

declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;
use Tools\CodeStyle\ArrayLinesFixer;
use Tools\CodeStyle\AttributeOrderFixer;
use Tools\CodeStyle\BlankLineAfterBlockFixer;
use Tools\CodeStyle\BlankLineAroundMultilineStatementFixer;
use Tools\CodeStyle\DomainBootstrapperOrderFixer;
use Tools\CodeStyle\ModelSectionsFixer;
use Tools\CodeStyle\StandaloneAttributeFixer;
use Tools\CodeStyle\StateSectionsFixer;
use Tools\CodeStyle\TernaryReturnFixer;
use Tools\CodeStyle\TypedClassConstantFixer;

// The project's own code-style fixers, run after Pint by composer lint and lint:check, each over the folders its
// supports() names; at the root, Pint's parallel workers would read it without the project's autoloader. The
// containers' PHP is newer than the fixer's declared range, but its fixers only read this project's code.
return new Config()
    ->setUnsupportedPhpVersionAllowed(true)
    ->setParallelConfig(ParallelConfigFactory::detect())
    ->registerCustomFixers([
        new BlankLineAroundMultilineStatementFixer(),
        new StandaloneAttributeFixer(),
        new AttributeOrderFixer(),
        new ArrayLinesFixer(),
        new BlankLineAfterBlockFixer(),
        new TernaryReturnFixer(),
        new ModelSectionsFixer(),
        new StateSectionsFixer(),
        new DomainBootstrapperOrderFixer(),
        new TypedClassConstantFixer(),
    ])
    ->setRules([
        'Journal/blank_line_around_multiline_statement' => true,
        'Journal/standalone_attribute' => true,
        'Journal/attribute_order' => true,
        'Journal/array_lines' => true,
        'Journal/blank_line_after_block' => true,
        'Journal/ternary_return' => true,
        'Journal/model_sections' => true,
        'Journal/state_sections' => true,
        'Journal/domain_bootstrapper_order' => true,
        'Journal/typed_class_constant' => true,
    ])
    ->setUsingCache(true)
    ->setCacheFile('storage/framework/cache/php-cs-fixer.cache')
    ->setFinder(new Finder()->in([
        dirname(__DIR__, 2).'/app',
        dirname(__DIR__, 2).'/domain',
        dirname(__DIR__, 2).'/tests',
        dirname(__DIR__, 2).'/tools',
    ])->exclude([
        'resources',
        'node_modules',
    ]));
