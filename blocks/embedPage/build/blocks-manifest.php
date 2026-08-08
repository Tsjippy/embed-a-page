<?php
// This file is generated. Do not modify it manually.
return array(
	'build' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'tsjippy-embed-page/show',
		'version' => '0.1.0',
		'title' => 'Embed another page',
		'category' => 'widgets',
		'description' => 'Embed another site page so it shows in multiple locations',
		'textdomain' => 'tsjippy',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'pageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'hide' => array(
				'type' => 'boolean',
				'default' => false
			),
			'newline' => array(
				'type' => 'boolean',
				'default' => false
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			)
		)
	)
);
