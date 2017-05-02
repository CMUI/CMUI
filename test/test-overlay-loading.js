describe('Overlay - Loading', function () {
	const imgUrl = 'http://file.baixing.net/201701/cmui-demo-dialog-img.png'

	afterEach(() => {
		CMUI.dialog.hide()
		$('.cm-dialog').remove()
	})

	describe('JS API', () => {
		describe('CMUI.dialog.create()', () => {
			describe('tag', () => {
				it('generates default tag "div" if no param given', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					assert.equal($emptyDialog[0].tagName.toLocaleLowerCase(), 'div')
				})
				it('uses given tag to generate dialog', () => {
					const tag = 'form'
					const elem = CMUI.dialog.create({ tag })
					assert.equal(elem.tagName.toLocaleLowerCase(), tag)
				})
			})

			describe('id', () => {
				it('does not generate any id if no param given', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					assert(!$emptyDialog.attr('id'))
				})
				it('sets given id to generated dialog element - id', () => {
					const id = _.uniqueId('test-dialog-id-')
					const elem = CMUI.dialog.create({ id })
					assert.equal(elem.id, id)
				})
				it('sets given id to generated dialog element - hash', () => {
					// const id = _.uniqueId('test-dialog-id-')
					// const elem = CMUI.dialog.create({ id: '#' + id })
					// assert.equal(elem.id, id)
				})
				it('sets given id to generated dialog element - trimming id', () => {
					// const id = _.uniqueId('test-dialog-id-')
					// const elem = CMUI.dialog.create({ id: ' ' + id + ' ' })
					// assert.equal(elem.id, id)
				})
				it('sets given id to generated dialog element - trimming hash', () => {
					// const id = _.uniqueId('test-dialog-id-')
					// const elem = CMUI.dialog.create({ id: '   #' + id + ' ' })
					// assert.equal(elem.id, id)
				})
			})

			describe('img', () => {
				it('does not generate img wrapper if no param given - url', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					const $imgWrapper = $emptyDialog.find('.cm-dialog-img')
					assert($imgWrapper.length === 0)
				})
				it('does not generate img wrapper if no param given - config', () => {
					// const img = {}
					// const elem = CMUI.dialog.create({ img })
					// const $imgWrapper = $(elem).find('.cm-dialog-img')
					// console.log($imgWrapper.html())
					// assert($imgWrapper.length === 0)
				})
				it('sets given img to generated dialog element - given url', () => {
					const img = imgUrl
					const elem = CMUI.dialog.create({ img })
					const imgSrc = $(elem).find('.cm-dialog-img img').attr('src')
					assert.equal(imgSrc, img)
				})
				it('sets given img to generated dialog element - given config - only url', () => {
					// const img = {
					// 	url: imgUrl,
					// }
					// const elem = CMUI.dialog.create({ img })
					// const imgSrc = $(elem).find('.cm-dialog-img img').attr('src')
					// assert.equal(imgSrc, img.url)
				})
				it('sets given img to generated dialog element - given config - url and height', () => {
					// const img = {
					// 	url: imgUrl,
					// 	height: 100,
					// }
					// const elem = CMUI.dialog.create({ img })
					// const imgSrc = $(elem).find('.cm-dialog-img img').attr('src')
					// assert.equal(imgSrc, img.url)
				})
				it('sets given img to generated dialog element - given config - url and width', () => {
					// const img = {
					// 	url: imgUrl,
					// 	width: 100,
					// }
					// const elem = CMUI.dialog.create({ img })
					// const imgSrc = $(elem).find('.cm-dialog-img img').attr('src')
					// assert.equal(imgSrc, img.url)
				})
				it('sets given img to generated dialog element - given config - url, width and height', () => {
					// const img = {
					// 	url: imgUrl,
					// 	height: 100,
					// 	weight: 100,
					// }
					// const elem = CMUI.dialog.create({ img })
					// const imgSrc = $(elem).find('.cm-dialog-img img').attr('src')
					// assert.equal(imgSrc, img.url)
				})
			})

			describe('title', () =>{
				it('generates default title "提示" if no param given', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					const title = $emptyDialog.find('.cm-dialog-header-title').html()
					assert.equal(title, '提示')
				})
				it('does not generate title if no param given but img given', () => {
					const img = imgUrl
					const elem = CMUI.dialog.create({ img })
					const $titleWrapper = $(elem).find('.cm-dialog-header-title')
					assert($titleWrapper.length === 0)
				})
				it('sets given title to generated dialog element', () => {
					const title = _.uniqueId('test-dialog-title-')
					const elem = CMUI.dialog.create({ title })
					const elemTitle = $(elem).find('.cm-dialog-header-title').html()
					assert.equal(elemTitle, title)
				})
			})

			describe('content', () =>{
				it('does not generate any content if no param given', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					const $contentWrapper = $emptyDialog.find('.cm-dialog-content')
					assert($contentWrapper.length === 0)
				})
				it('sets given content to generated dialog element - text', () => {
					const content = 'test-dialog-title-' + Math.random()
					const elem = CMUI.dialog.create({ content })
					const elemContent = $(elem).find('.cm-dialog-content').html()
					assert.equal(elemContent, content)
				})
				it('sets given content to generated dialog element - html', () => {
					const content = `<p> ${Math.random()} </p>`
					const elem = CMUI.dialog.create({ content })
					const elemContent = $(elem).find('.cm-dialog-content').html()
					assert.equal(elemContent, content)
				})
			})

			describe('btn', () =>{
				it('does not generate footer if no btn given', () => {
					const $emptyDialog = $(CMUI.dialog.create())
					const $footer = $emptyDialog.find('.cm-dialog-footer')
					assert($footer.length === 0)
				})
				it('does not generate any btn if no btn detail given', () => {
					const elem = CMUI.dialog.create({ btn: {} })
					const $footer = $(elem).find('.cm-dialog-footer')
					assert.equal($footer.html().trim(), '')
				})
				describe('primary', () => {
					describe('tag', () => {
						it('generates default tag "button" if no param given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), 'button')
						})
						it('uses given tag "a" to generate btn', () => {
							const tag = 'a'
							const btn = { primary: { tag } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), tag)
						})
						it('ignores given tag if it is not "button" or "a"', () => {
							const btn = { primary: { tag: "div" } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), 'button')
						})
					})
					describe('innerHTML', () => {
						it('generates default innerHTML "确定" if no param given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn.html(), '确定')
						})
						it('sets given innerHTML to generated btn', () => {
							const innerHTML = `test-dialog-btn-inner-html-<strong>${Math.random()}</strong>`
							const btn = { primary: { innerHTML } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn.html(), innerHTML)
						})
					})
					describe('link', () => {
						it('ignores link param if tag "a" is not given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert(!$btn.attr('href'))
						})
						it('sets given innerHTML to generated btn if tag "a" is given', () => {
							const link = 'http://cmui.net/?' + Math.random()
							const btn = { primary: {
								tag: "a",
								link,
							} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn.attr('href'), link)
						})
					})
					describe('className', () => {
						// TODO: function assetClassNames()
						const arrayClassName = [
							' foo  ',
							'bar',
							'  test-dialog-class '
						]
						it('generates default classNames if no param given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							const classList = Array.from($btn[0].classList)
							assert(classList.includes('cm-btn'))
							assert(classList.includes('cm-btn-primary'))
							assert(classList.length === 2)
						})
						it('sets given classNames to generated btn - string of classNames - single', () => {
							const classNames = arrayClassName[0]
							const btn = { primary: { className: classNames } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							const classList = Array.from($btn[0].classList)
							assert(classList.includes(classNames.trim()))
							assert(classList.length === 1)
						})
						it('sets given classNames to generated btn - string of classNames - multi', () => {
							const classNames = arrayClassName.join(' ')
							const btn = { primary: { className: classNames } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							const classList = Array.from($btn[0].classList)
							arrayClassName.forEach((item) => {
								assert(classList.includes(item.trim()))
							})
							assert.equal(arrayClassName.length, classList.length)
						})
						it('sets given classNames to generated btn - array', () => {
							const btn = { primary: { className: arrayClassName } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							const classList = Array.from($btn[0].classList)
							arrayClassName.forEach((item) => {
								assert(classList.includes(item.trim()))
							})
							assert.equal(arrayClassName.length, classList.length)
						})
					})
					describe('action', () => {
						it('does not generate any action if no param given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert(!$btn.attr('data-action'))
						})
						it('sets given action to generated dialog element', () => {
							const action = 'test-dialog-btn-action-' + Math.random()
							const btn = { primary: { action } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal($btn.attr('data-action'), action)
						})
					})
					describe('hideDialog', () => {
						it('generates btn which does not hide dialog if no param given', () => {
							const btn = { primary: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal(assert._util.isDialogShown(elem), false)
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), true)
						})
						it('generates btn which does not hide dialog if given param is falsy', () => {
							const btn = { primary: { hideDialog: 0 } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal(assert._util.isDialogShown(elem), false)
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), true)
						})
						it('generates btn which can hide dialog if given param is true', () => {
							const btn = { primary: { hideDialog: 1 } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:first-child')
							assert.equal(assert._util.isDialogShown(elem), false)
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), false)
						})
					})
				})
				describe('minor', () => {
					describe('tag', () => {
						it('generates default tag "button" if no param given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), 'button')
						})
						it('uses given tag "a" to generate btn', () => {
							const tag = 'a'
							const btn = { minor: { tag } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), tag)
						})
						it('ignores given tag if it is not "button" or "a"', () => {
							const btn = { minor: { tag: "div" } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn[0].tagName.toLocaleLowerCase(), 'button')
						})
					})
					describe('innerHTML', () => {
						it('generates default innerHTML "取消" if no param given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn.html(), '取消')
						})
						it('sets given innerHTML to generated btn', () => {
							const innerHTML = `test-dialog-btn-inner-html-<strong>${Math.random()}</strong>`
							const btn = { minor: { innerHTML } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn.html(), innerHTML)
						})
					})
					describe('link', () => {
						it('ignores link param if tag "a" is not given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert(!$btn.attr('href'))
						})
						it('sets given innerHTML to generated btn if tag "a" is given', () => {
							const link = 'http://cmui.net/?' + Math.random()
							const btn = { minor: {
								tag: "a",
								link,
							} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn.attr('href'), link)
						})
					})
					describe('className', () => {
						// TODO: function assetClassNames()
						const arrayClassName = [
							' foo  ',
							'bar',
							'  test-dialog-class '
						]
						it('generates default classNames if no param given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							const classList = Array.from($btn[0].classList)
							assert(classList.includes('cm-btn'))
							assert(classList.includes('cm-btn-primary'))
							assert(classList.includes('cm-btn-bordered'))
							assert(classList.length === 3)
						})
						it('sets given classNames to generated btn - string of classNames - single', () => {
							const classNames = arrayClassName[0]
							const btn = { minor: { className: classNames } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							const classList = Array.from($btn[0].classList)
							assert(classList.includes(classNames.trim()))
							assert(classList.length === 1)
						})
						it('sets given classNames to generated btn - string of classNames - multi', () => {
							const classNames = arrayClassName.join(' ')
							const btn = { minor: { className: classNames } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							const classList = Array.from($btn[0].classList)
							arrayClassName.forEach((item) => {
								assert(classList.includes(item.trim()))
							})
							assert.equal(arrayClassName.length, classList.length)
						})
						it('sets given classNames to generated btn - array', () => {
							const btn = { minor: { className: arrayClassName } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							const classList = Array.from($btn[0].classList)
							arrayClassName.forEach((item) => {
								assert(classList.includes(item.trim()))
							})
							assert.equal(arrayClassName.length, classList.length)
						})
					})
					describe('action', () => {
						it('does not generate any action if no param given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert(!$btn.attr('data-action'))
						})
						it('sets given action to generated dialog element', () => {
							const action = 'test-dialog-btn-action-' + Math.random()
							const btn = { minor: { action } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							assert.equal($btn.attr('data-action'), action)
						})
					})
					describe('hideDialog', () => {
						it('generates btn which does not hide dialog if no param given', () => {
							const btn = { minor: {} }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), true)
						})
						it('generates btn which does not hide dialog if given param is falsy', () => {
							const btn = { minor: { hideDialog: 0 } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), true)
						})
						it('generates btn which can hide dialog if given param is true', () => {
							const btn = { minor: { hideDialog: 1 } }
							const elem = CMUI.dialog.create({ btn })
							const $btn = $(elem).find('.cm-dialog-footer *:last-child')
							CMUI.dialog.show(elem)
							$btn.click()
							assert.equal(assert._util.isDialogShown(elem), false)
						})
					})
				})
			})
		})

		describe('CMUI.dialog.show()', () => {
			it('shows a dialog - selector', () => {
				const id = _.uniqueId('test-dialog-id-')
				const elem = CMUI.dialog.create({ id })
				assert.equal(assert._util.isDialogShown(elem), false)
				CMUI.dialog.show('#' + id)
				assert.equal(assert._util.isDialogShown(elem), true)
			})
			it('shows a dialog - dom element', () => {
				const elem = CMUI.dialog.create()
				assert.equal(assert._util.isDialogShown(elem), false)
				CMUI.dialog.show(elem)
				assert.equal(assert._util.isDialogShown(elem), true)
			})
			it('shows a dialog - $ element', () => {
				const elem = CMUI.dialog.create()
				assert.equal(assert._util.isDialogShown(elem), false)
				CMUI.dialog.show($(elem))
				assert.equal(assert._util.isDialogShown(elem), true)
			})
			it('also shows mask', () => {
				const elem = CMUI.dialog.create()
				assert.equal(assert._util.isMaskShown(), false)
				CMUI.dialog.show(elem)
				assert.equal(assert._util.isMaskShown(), true)
			})
			describe('autoHideDelay', () => {
				it('will not auto hide if no param given', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem)
					setTimeout(() => {
						assert.equal(assert._util.isDialogShown(elem), true)
						done()
					}, 1100)
				})
				it('will not auto hide if given param is 0', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem, { autoHideDelay: 0 })
					setTimeout(() => {
						assert.equal(assert._util.isDialogShown(elem), true)
						done()
					}, 1100)
				})
				it('will not auto hide if given param is negative', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem, { autoHideDelay: -100 })
					setTimeout(() => {
						assert.equal(assert._util.isDialogShown(elem), true)
						done()
					}, 1100)
				})
				it('will not auto hide if given param is illegal', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem, { autoHideDelay: 'foo' })
					setTimeout(() => {
						assert.equal(assert._util.isDialogShown(elem), true)
						done()
					}, 1100)
				})
				it('will auto hide according to given param', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem, { autoHideDelay: 1 })
					assert.equal(assert._util.isDialogShown(elem), true)
					setTimeout(() => {
						assert.equal(assert._util.isDialogShown(elem), false)
						done()
					}, 1100)
				})

				it('generates auto-hide hint if given param is ok', (done) => {
					const elem = CMUI.dialog.create()
					CMUI.dialog.show(elem, { autoHideDelay: 1 })
					const $hintWrapper = $(elem).find('.cm-dialog-auto-hide')
					assert($hintWrapper.length > 0)
					setTimeout(() => {
						done()
					}, 1100)
				})
			})

			// TODO: show more than one dialog

		})

		// TODO: .hide()


	})

	describe('Actions', () => {
		describe('cm-dialog-hide', () => {
			// TODO
		})

	})
})

