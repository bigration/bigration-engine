import { templateRenderObject } from './template-render-object';

describe('telegram consumer', () => {
  it('templateRenderObject if else', async () => {
    const compiled = templateRenderObject(
      { fo: 'bar' },
      "{{#if (eq fo 'bar')}}\n" + 'Hello' + '{{/if}}'
    );
    expect(compiled).toEqual('Hello');
  });

  it('templateRenderObject equals', async () => {
    const compiled = templateRenderObject({ fo: 'bar' }, "{{{eq fo 'bar' }}}");
    expect(compiled).toEqual('true');
  });

  it('templateRenderObject replace {{text}}', async () => {
    const compiled = templateRenderObject({ fo: 'bar' }, 'hey {{fo}}');
    expect(compiled).toEqual('hey bar');
  });

  it('templateRenderObject replace {{{text}}}', async () => {
    const compiled = templateRenderObject({ fo: 'bar' }, 'hey {{{fo}}}');
    expect(compiled).toEqual('hey bar');
  });

  it('with loop replace', async () => {
    const compiled = templateRenderObject(
      { bodyObject: body.object },
      '{{#each bodyObject.attachments}}\n' +
        "{{#if (eq this.type 'photo')}}{{this.type}} {{/if}}" +
        '{{/each}}'
    );
    expect(compiled).toEqual('photo photo photo ');
  });
});

const body = {
  group_id: 26020797,
  type: 'wall_post_new',
  event_id: 'ca77588a7dda6639df19e826abbb7efbc48bbc7b',
  v: '5.131',
  object: {
    id: 129482,
    from_id: -26020797,
    owner_id: -26020797,
    date: 1677065340,
    postponed_id: 129468,
    marked_as_ads: 0,
    can_edit: 1,
    created_by: 6236672,
    can_delete: 1,
    donut: {
      is_donut: false,
    },
    comments: {
      count: 0,
    },
    short_text_rate: 0.8,
    compact_attachments_before_cut: 1,
    type: 'post',
    carousel_offset: 0,
    attachments: [
      {
        type: 'photo',
        photo: {
          album_id: -7,
          date: 1677004584,
          id: 457367303,
          owner_id: -26020797,
          access_key: 'c8f1ceafbfcb623f69',
          sizes: [
            {
              height: 75,
              type: 's',
              width: 50,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/ytof4FNrUBeDQQ21w8UjoYXRcQUySN773dhRhVY5pXpOoGQVfgXvOUf5g7hbmB9JuYHB4rscOv77FvXy_IEGWqjy.jpg?size=50x75&quality=95&type=album',
            },
            {
              height: 130,
              type: 'm',
              width: 87,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/DUpdWEpfrbPcHsxjpCbrVy6bcZ4hJzd-d3piqb39Vr0dxiJoS2j-vjKlhBo54fO9324LA_Ikn1x65hTaUEkGQKNB.jpg?size=87x130&quality=95&type=album',
            },
            {
              height: 604,
              type: 'x',
              width: 403,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/zAgYbsutUQW6zHJhhi0AD_crIQSjKP-JnROsZIoi8DyWMG04RH2nQAN8n6kZeVnACyaelUq-nku3W5D9VZE2n2zv.jpg?size=403x604&quality=95&type=album',
            },
            {
              height: 807,
              type: 'y',
              width: 539,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/J_2-LYolXaeF7Md1HkBuP6HHQ3jFCRI9n3VHBC9HppI2G-lCza-iSB_TTzuKZFAUV8laVcPAopEPx-ioU82Hl8t0.jpg?size=539x807&quality=95&type=album',
            },
            {
              height: 1080,
              type: 'z',
              width: 721,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/xB2vC1QLuogRYZW-ympqKQrlQz51xpnTjOWCX-3MsYN7kTHty8YgAOpM2k62H-SR1xSwyqqUQJlOUe_igtDAQEDi.jpg?size=721x1080&quality=95&type=album',
            },
            {
              height: 1200,
              type: 'w',
              width: 801,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/QNqgdZqvHvvUeDIHTssJLBJe5mWz9hx25g_tHfPYL-6sd4YZRZU2VFLt_TZmeiB5ZqrVu2ueZiPVBpZEVA7s8g6w.jpg?size=801x1200&quality=95&type=album',
            },
            {
              height: 195,
              type: 'o',
              width: 130,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/dtdYv_KQJ-E5qhxOthJTD7EXMD0tcPfL_jQdO5msT7mln8oSyqOvw5HP6-CgfOwUAh7-XQy2vauJJZ5pTuNouwMs.jpg?size=130x195&quality=95&type=album',
            },
            {
              height: 300,
              type: 'p',
              width: 200,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/TdEMZAziEnwjbPt_2hUKhUDKZkJnI6Xe_XejF9nYOn_qBfflLw_S5-E-lBzSr6rpwaDm0huzmhynOO-EqU66w5wj.jpg?size=200x300&quality=95&type=album',
            },
            {
              height: 479,
              type: 'q',
              width: 320,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/I0f2s7Mvq6J9SIqGWFAKyYBenj7IeFlJZu2MC2gobkWko1r_B19IuREFhf1DhWHq7zsJ1MF95dLDwn2oX5iBlTfU.jpg?size=320x479&quality=95&type=album',
            },
            {
              height: 764,
              type: 'r',
              width: 510,
              url: 'https://sun9-west.userapi.com/sun9-16/s/v1/ig2/gMUS9vjKxp9e6TP6Y1Dow2gFOBpKCmuGSomJED-RHtoOhxTFsRQrm4yFpBOkTXdVyeGmrAflaaRh-iMpWOqhWuM1.jpg?size=510x764&quality=95&type=album',
            },
          ],
          text: '',
          user_id: 100,
          has_tags: false,
        },
        style: 'full',
      },
      {
        type: 'photo',
        photo: {
          album_id: -7,
          date: 1677004584,
          id: 457367304,
          owner_id: -26020797,
          access_key: '65aeb72410af7eb09b',
          sizes: [
            {
              height: 75,
              type: 's',
              width: 50,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/z46hmQprn_SIFQPbfQtOM3qQyxDcSIZUNNEnwSaSi3sd0-m9Xz-YyxG-OPrs-W3XH7SMOdZygczP6-tcBvnV-Hdt.jpg?size=50x75&quality=95&type=album',
            },
            {
              height: 130,
              type: 'm',
              width: 87,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/-ztL9tmtCDJHULHqRYkroDpvjhA2Dy2Hp1pnDbITFRy9UBPlGMcR6PNur-L_OBPGCUW7xgKq25lZBABJCHMgiAwl.jpg?size=87x130&quality=95&type=album',
            },
            {
              height: 604,
              type: 'x',
              width: 403,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/6biQKR_i3uEeWo_3GlXgoBAGQSUhfjOqN0J5j5TI0lqGZsAgorglHpVXpHkYDWupNZ18r_g5ttmgSPDvO8fjCSdx.jpg?size=403x604&quality=95&type=album',
            },
            {
              height: 807,
              type: 'y',
              width: 539,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/j15WKOpMQ7EqzSdVXF-GaD3R47nhMaiXiyQHLKDY7JDKAyex79LUdG4lPmRD8ptBegz6ZTXTU2_qumafD2Z7oSxv.jpg?size=539x807&quality=95&type=album',
            },
            {
              height: 1080,
              type: 'z',
              width: 721,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/5Cz73EeitM2fE0Vxt1pwtUBKSJH97oeDKvbzdjUn0fee1TwA9VGhDG6pHo2o45BYRTcXjhcWxeAwgAnWAXiGh9Lk.jpg?size=721x1080&quality=95&type=album',
            },
            {
              height: 1200,
              type: 'w',
              width: 801,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/E4EZsUSfSpzzigcd_3Khx7XMXF2Mnsp70njWQMXJrOfnyGQJ-K1blHFG_HMcu3_hddtzN6EfwFXGZ-JaTeeblyG2.jpg?size=801x1200&quality=95&type=album',
            },
            {
              height: 195,
              type: 'o',
              width: 130,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/FfKYNwTTabPsoou5nypWXMCQOSCooD2rUeJBF6Z9G5KlDBbV9usLP0-EFiL6Y16etiKZnwZkWE-uMsBLB5BKbBNM.jpg?size=130x195&quality=95&type=album',
            },
            {
              height: 300,
              type: 'p',
              width: 200,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/hUcw6MeZ2x1JM-59PR7smRm3ntgcssa1B1XyqD9WDINyDo3f0JYu8n9SFNTR9Bxav09S47X7f3YlviBL5jVh2pUe.jpg?size=200x300&quality=95&type=album',
            },
            {
              height: 479,
              type: 'q',
              width: 320,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/cWyL3f7Vc1pUDJxsIea5dCQhg1CYwFH65sgCoXPz2LCCNNsTKCJuGIlIgQyz2kzTcDhQt5qlRxMIAk-Mrp6EoCCQ.jpg?size=320x479&quality=95&type=album',
            },
            {
              height: 764,
              type: 'r',
              width: 510,
              url: 'https://sun9-west.userapi.com/sun9-52/s/v1/ig2/yQCTdUQpNLZfX8ImbRTQpFw7VLTIOiLIU2SnGFqZNkPS-6PUXwmoZQjBhilOC85P0nutVcMUv53Y61oLa-9-h9jo.jpg?size=510x764&quality=95&type=album',
            },
          ],
          text: '',
          user_id: 100,
          has_tags: false,
        },
        style: 'full',
      },
      {
        type: 'photo',
        photo: {
          album_id: -7,
          date: 1677004584,
          id: 457367305,
          owner_id: -26020797,
          access_key: 'f40f091d10ebd28e48',
          sizes: [
            {
              height: 75,
              type: 's',
              width: 50,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/j5NUU-71rWEblljgOwASFeFqDHFO1H3e09n9vLEHDqvFfNimvrnm2PDf9HNZvVRfAWPKxM1meJQR1rmgT597dwk8.jpg?size=50x75&quality=95&type=album',
            },
            {
              height: 130,
              type: 'm',
              width: 87,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/Eg04ziKHScKMf4z6DwVWlPoMzSrGqdUZ_JYhGTi5NCKs4mSy7-RIP7vKLhQ98YIZUPo3RJiSfW2vwboWrmRbYJiA.jpg?size=87x130&quality=95&type=album',
            },
            {
              height: 604,
              type: 'x',
              width: 403,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/-s5RLk6M_LxiSCKg1puqfPuOxufMEcuY_LpYK-2EIsbA2FKJNtzAhMCAZ-W7R7CSiYpOanGVG4OPx59Hx_aKYYqT.jpg?size=403x604&quality=95&type=album',
            },
            {
              height: 807,
              type: 'y',
              width: 539,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/ANK6giH2MHwkYWZX90Cu1aDCEnwy3R_Dlirl2OgDskxNIHors0TFZgwvYvjv9xkskowklp8Oci4ifnvQDYejE5zf.jpg?size=539x807&quality=95&type=album',
            },
            {
              height: 1080,
              type: 'z',
              width: 721,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/0sD6lXqytlhU8upCEN6pOKUvyIMA3ijgireuwvLDUmt3T_jVGJiBfMKqAUYV4h6uxmQroqgxzU6w2TjyF64S1WTg.jpg?size=721x1080&quality=95&type=album',
            },
            {
              height: 1200,
              type: 'w',
              width: 801,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/WiaWahst_II_1T3Hxq7iHfw_AcjRWT-JK-3TwLlDbZEwQHAjIuPPQQ01lC5gCmNf_Za6UcVJpOgVu-D9tZXpSHuW.jpg?size=801x1200&quality=95&type=album',
            },
            {
              height: 195,
              type: 'o',
              width: 130,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/rBfiFTs4-i6xYuZhbtZKdrm6UPvwesZjfugrEYY_lkD-V_22oIWLBwcTTbxjcQIpQH3aPS6Ej6J9hZiww8OxRHjz.jpg?size=130x195&quality=95&type=album',
            },
            {
              height: 300,
              type: 'p',
              width: 200,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/JcNDzWfN8zr7nCOsgsOhnlU2TbY36NHLABVXwy3oaxZvaVDhMJyRfVK0W5oQRnuzCw7v4_obwJMFpBj4XMXGINpb.jpg?size=200x300&quality=95&type=album',
            },
            {
              height: 479,
              type: 'q',
              width: 320,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/Nm1141iOuCVDl8FuAeVtJ9XymCezpW-5jKC6kJFClrmzoGdiVXl7bhXtxFOrJf65iYIlumEStWJvdAkNa6rYFUi1.jpg?size=320x479&quality=95&type=album',
            },
            {
              height: 764,
              type: 'r',
              width: 510,
              url: 'https://sun9-west.userapi.com/sun9-37/s/v1/ig2/8VGeCYuvpbR0zOletVcOm4OWZiZtFEicgaR3u4qATPCF44Lx0Lx6pQnLV_5wI_4pmawIsSDC4uAuJQMxSFbrQtmQ.jpg?size=510x764&quality=95&type=album',
            },
          ],
          text: '',
          user_id: 100,
          has_tags: false,
        },
        style: 'full',
      },
      {
        type: 'link',
        link: {
          url: 'https://t.me/youngfolks_ru',
          description: 'You can view and join @youngfolks_ru right away.',
          is_favorite: false,
          photo: {
            album_id: -26,
            date: 1677004592,
            id: 457422728,
            owner_id: 2000030232,
            sizes: [
              {
                height: 130,
                type: 'm',
                width: 130,
                url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/os_ELZzkwIZsjkWUFAa2zTu5xry7A2IawzZ__1EtkXZ902lSk1F9Ol_hdWPbm-39JVfqnzYnD7uu3vtqIFXbirMb.jpg?size=130x130&quality=96&type=album',
              },
              {
                height: 150,
                type: 'p',
                width: 150,
                url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/Rf3wpR0F1VGHAiHhJO0FpthOM4U_eikYo2vYZ8Z3bOpgN4MK2S6hp1yr6O753OnEo9-zPYpqci4AaSKxE04Cze-_.jpg?size=150x150&quality=96&type=album',
              },
              {
                height: 75,
                type: 's',
                width: 75,
                url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/UhHhrHk9q943kOHMFqCQ2XFAUaXuokPFhUAOrIWjmKQ5F3OnYJOF483oEeMVDyPMw-CHsAjE9qaGnHlxCkWcgQy3.jpg?size=75x75&quality=96&type=album',
              },
              {
                height: 150,
                type: 'x',
                width: 150,
                url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/Rf3wpR0F1VGHAiHhJO0FpthOM4U_eikYo2vYZ8Z3bOpgN4MK2S6hp1yr6O753OnEo9-zPYpqci4AaSKxE04Cze-_.jpg?size=150x150&quality=96&type=album',
              },
            ],
            text: '',
            user_id: 100,
            has_tags: false,
          },
          title: 'Young Folks',
          target: 'internal',
        },
        style: 'compact',
        compact: {
          icons: [
            {
              sizes: [
                {
                  height: 75,
                  type: 's',
                  width: 75,
                  url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/UhHhrHk9q943kOHMFqCQ2XFAUaXuokPFhUAOrIWjmKQ5F3OnYJOF483oEeMVDyPMw-CHsAjE9qaGnHlxCkWcgQy3.jpg?size=75x75&quality=96&type=album',
                },
                {
                  height: 130,
                  type: 'm',
                  width: 130,
                  url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/os_ELZzkwIZsjkWUFAa2zTu5xry7A2IawzZ__1EtkXZ902lSk1F9Ol_hdWPbm-39JVfqnzYnD7uu3vtqIFXbirMb.jpg?size=130x130&quality=96&type=album',
                },
                {
                  height: 150,
                  type: 'x',
                  width: 150,
                  url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/Rf3wpR0F1VGHAiHhJO0FpthOM4U_eikYo2vYZ8Z3bOpgN4MK2S6hp1yr6O753OnEo9-zPYpqci4AaSKxE04Cze-_.jpg?size=150x150&quality=96&type=album',
                },
                {
                  height: 150,
                  type: 'p',
                  width: 150,
                  url: 'https://sun9-east.userapi.com/sun9-27/s/v1/ig2/Rf3wpR0F1VGHAiHhJO0FpthOM4U_eikYo2vYZ8Z3bOpgN4MK2S6hp1yr6O753OnEo9-zPYpqci4AaSKxE04Cze-_.jpg?size=150x150&quality=96&type=album',
                },
              ],
            },
          ],
          title: {
            text: {
              text: 'Young Folks',
            },
          },
          description: {
            text: {
              text: 't.me',
            },
          },
        },
      },
    ],
    is_favorite: false,
    post_type: 'post',
    signer_id: 91408058,
    text: '#native@youngfolks\n\nMd: [id393425948|Наташа Счастливая]\n\nTelegram: https://t.me/youngfolks_ru \nInstagram: https://www.instagram.com/youngfolks_ru',
    hash: '5Rs4t0x5pHoLHzGJ7ejnwfncYg',
  },
};
